import { format, pathToFileURL } from 'url';
import { app, BrowserWindow, ipcMain, Menu } from 'electron';

import { oneKeyInput } from './utils/key';
import { exportHe, importHe } from './files/he';
import * as MSG from '../share/define/message';
import { openProject, saveProject } from './files/project';
import { v4 } from 'internal-ip'
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { RegisterProps } from './utils/server';
import express from 'express';
import path from 'path';
import { stat, readFile } from 'fs'

let win: Electron.BrowserWindow | null;
let io: Server| null;
let socketID: string = '';

function createWindow() {
  win = new BrowserWindow({
    width: 1110,
    height: 824,
    // transparent: true,
    // frame: false,
    backgroundColor: '#000',

    webPreferences: {
      // about remote: https://www.electronjs.org/docs/api/remote#remote
      // enableRemoteModule break change: https://www.electronjs.org/docs/breaking-changes#default-changed-enableremotemodule-defaults-to-false
      // 官方不建议使用 remote 模块：https://medium.com/@nornagon/electrons-remote-module-considered-harmful-70d69500f31
      enableRemoteModule: false,
      // 存在安全问题：https://www.electronjs.org/docs/tutorial/security#2-do-not-enable-nodejs-integration-for-remote-content
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, './preload.js'),
    },
  });

  Menu.setApplicationMenu(null);

  const httpServer = createServer(express());
  io = new Server(httpServer);
  httpServer.listen(3000);
  io!.on('connection', (socket: Socket) => {
    socket.on('register', (data) => {
      let props = JSON.parse(data) as RegisterProps;
      socketID = socket.id;
      win!.webContents.send(MSG.CONNECT, props.name);
    })
    socket.on("disconnecting", (reason) => {
      console.log(`${socket.id} disconnected`);
      socketID = '';
      win!.webContents.send(MSG.DISCONNECT, reason);
    });

  })
  if (process.env.NODE_ENV === 'development') {
    win.loadURL('http://localhost:8000/#/');
    win.webContents.openDevTools();
  } else {
    win.loadURL(format(pathToFileURL(path.join(__dirname, './index.html'))));
  }

  /**
   * 根据[官方文档](https://www.electronjs.org/docs/api/web-contents#contentssetdevtoolswebcontentsdevtoolswebcontents)的介绍
   * “developers have very limited control of” 推测不能在 DevTools 中监听按键事件，故当前无法在聚焦 DevTools 通过 F12 关闭 DevTools。
   */
  win.webContents.on('before-input-event', (_, input) => {
    if (oneKeyInput(input, 'f12')) {
      win!.webContents.toggleDevTools();
    }
    if (oneKeyInput(input, 'f5')) {
      win!.webContents.reload();
    }
  });

  win.on('closed', () => {
    win = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

ipcMain.handle('getGlobal', async (_, ...names) => {
  return names.map((item) => global[item]);
});

ipcMain.on(MSG.PAGE_CHG_DASHBORDER, () => {
  win!.setSize(1440, 1080);
  win!.center();
  // setApplicationMenu();
});

ipcMain.handle(MSG.IMPORT_HE, async (event) => {
  const result = await importHe();
  return result;
});

ipcMain.on(MSG.EXPORT_HE, (event, data) => {
  exportHe(data);
});

ipcMain.handle(MSG.OPEN_PROJ, async (event) => {
  const result = await openProject();
  return result;
});

ipcMain.handle(MSG.SAVE_PROJ, async(event, name, url, data) => {
  const result = saveProject(name, url, data);
  return result;
});

ipcMain.handle(MSG.GET_IP, async(event) => {
  const result = await v4();
  return result;
});

ipcMain.on(MSG.TRANSMIT, (event, audio, stream) => {
  console.log(audio);
  console.log(stream);
  if (socketID === '' || !io?.sockets.sockets.has(socketID)) {
    win!.webContents.send(MSG.TRANSMIT, false, 'unregistered');
  }
  else {
    let socket: Socket = io?.sockets.sockets.get(socketID)!;
    socket.emit('transmit-he', stream);
    socket.on('transmit-he', (res1) => {
      if (!res1)
        win!.webContents.send(MSG.TRANSMIT, false, 'he error');
      else {
        if (audio !== '') {
          try {
            stat(audio, (err, stat) => {
              if (err)
                throw err;
              if (!stat.isFile()) {
                win!.webContents.send(MSG.TRANSMIT, false, 'audio url error');
              }
              else {
                readFile(audio, (err, data) => {
                  if (err)
                    throw err;
                  socket.emit('transmit-audio', data);
                  socket.on('transmit-audio', (res2) => {
                    if (!res2)
                      win!.webContents.send(MSG.TRANSMIT, false, 'music error');
                    else {
                      socket.emit('play');
                      win!.webContents.send(MSG.TRANSMIT, true, 'play he with audio');
                    }
                  })
                });
              }
            });
          }
          catch (err) {
            win!.webContents.send(MSG.TRANSMIT, false, 'audio error');
          }
        }
        else {
          socket.emit('play');          
          win!.webContents.send(MSG.TRANSMIT, true, 'play he');
        }
      }
    })
  }
})
