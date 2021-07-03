import { format, pathToFileURL } from 'url';
import { app, BrowserWindow, ipcMain, Menu, shell } from 'electron';

import { oneKeyInput } from './utils/key';
import { exportHe, importHe, loadHe } from './files/he';
import * as MSG from '../share/define/message';
import { getProjectPath, openProject, saveProject } from './files/project';
import { v4 } from 'internal-ip'
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { RegisterProps } from './utils/server';
import path from 'path';
import { stat, readFile } from 'fs'
import { getAudioPath, importAudio, loadWave } from './files/audio';
import fs, { promises as fsp } from 'fs';
import { isNull, isUndefined } from 'lodash';
import { IpcImportLibProps } from 'src/share/define/ipc';
import { LibraryManager } from './lib';

const log = require('electron-log');


let win: Electron.BrowserWindow | null;
let io: Server | null;
let socketID: string = '';
function createWindow() {
  win = new BrowserWindow({
    width: 1110,
    height: 824,
    // transparent: true,
    // frame: false,
    backgroundColor: '#000',
    icon: path.join(__dirname, '../../static/icon.png'),
    webPreferences: {
      // about remote: https://www.electronjs.org/docs/api/remote#remote
      // enableRemoteModule break change: https://www.electronjs.org/docs/breaking-changes#default-changed-enableremotemodule-defaults-to-false
      // 官方不建议使用 remote 模块：https://medium.com/@nornagon/electrons-remote-module-considered-harmful-70d69500f31
      enableRemoteModule: false,
      // 存在安全问题：https://www.electronjs.org/docs/tutorial/security#2-do-not-enable-nodejs-integration-for-remote-content
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false,
      preload: path.join(__dirname, './preload.js'),
    },
  });

  Menu.setApplicationMenu(null);

  // initLibrary();

  const express = require('express');
  const httpServer = createServer(express());
  io = new Server(httpServer);
  httpServer.listen(3000);
  io!.on('connection', (socket: Socket) => {
    socket.on('register', (data) => {
      log.info('register', data);
      try {
        let props = JSON.parse(data) as RegisterProps;
        socketID = socket.id;
        win!.webContents.send(MSG.CONNECT, props.name);
      }
      catch (e) {
        log.error('register error', e);
      }
    })
    socket.on("disconnecting", (reason) => {
      log.info(`${socket.id} disconnected`);
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

app.on('second-instance', (event, commandLine, workingDirectory) => {
  // 当运行第二个实例时,将会聚焦到myWindow这个窗口
  if (win) {
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

ipcMain.handle('getGlobal', async (_, ...names) => {
  return names.map((item) => global[item]);
});

ipcMain.on(MSG.PAGE_CHG_LOGIN, () => {
  if (!isNull(win)) {
    if (win.isMaximized()) {
      win.unmaximize();
    }
    win.setSize(1110, 824);
    win.center();
  }
});

ipcMain.handle(MSG.PAGE_CHG_DASHBORDER, async () => {
  win!.setSize(1440, 1080);
  win!.center();
  return;
});

ipcMain.handle(MSG.PAGE_CHG_MAIN, async () => {
  win!.maximize();
  return;
});

ipcMain.on(MSG.MINIMIZE, (event) => {
  win?.minimize();
});

ipcMain.on(MSG.MAXIMIZE, (event) => {
  if (!isNull(win)) {
    if (win.isMaximized()) {
      win.unmaximize();
      win.center();
    }
    else
      win.maximize();
  }
});


ipcMain.on(MSG.WEB, (event) => {
  shell.openExternal("http://www.richtap-haptics.com/news?id=12");
});

ipcMain.handle(MSG.IMPORT_AUDIO, async (event, filePath, projName) => {
  if (filePath === '')
    filePath = await getAudioPath();
  if (filePath === '')
    return;
  return await importAudio(projName, filePath);
});

ipcMain.handle(MSG.LOAD_AUDIO, async (event, name) => {
  try {
    fsp.access(name, fs.constants.F_OK | fs.constants.R_OK);
    log.info(MSG.LOAD_AUDIO, name);
    return await loadWave(name);
  }
  catch (err) {
    log.error(MSG.LOAD_AUDIO, err)
    return;
  }
})

ipcMain.handle(MSG.IMPORT_HE, async (event) => {
  return await importHe();
});

ipcMain.on(MSG.EXPORT_HE, (event, data) => {
  exportHe(data);
});

ipcMain.handle(MSG.OPEN_PROJ, async (event, filePath?) => {
  if (filePath === '' || isUndefined(filePath)) {
    filePath = await getProjectPath();
  }
  if (isUndefined(filePath) || filePath === '')
    return;
  const result = await openProject(filePath);
  return result;
});

ipcMain.handle(MSG.SAVE_PROJ, async (event, id, name, url, data) => {
  const result = saveProject(id, name, url, data);
  return result;
});

ipcMain.handle(MSG.GET_IP, async (event) => {
  const result = await v4();
  return result;
});

ipcMain.on(MSG.TRANSMIT, (event, audio, stream) => {
  log.info(MSG.TRANSMIT, audio);
  //log.info(MSG.TRANSMIT, stream);
  if (socketID === '' || !io?.sockets.sockets.has(socketID)) {
    win!.webContents.send(MSG.TRANSMIT, false, 'unregistered');
  }
  else {
    let socket: Socket = io?.sockets.sockets.get(socketID)!;
    socket.emit('transmit-he', stream);
    socket.on('transmit-he', (res1) => {
      log.info('transmit-he', res1)
      if (!res1)
        win!.webContents.send(MSG.TRANSMIT, false, 'he error');
      else {
        if (audio !== '' && !isUndefined(audio)) {
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
          catch (e) {
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

ipcMain.handle(MSG.M2V, async (event, filePath, projName) => {
  const dir = path.join(app.getPath('userData'), projName);
  if (!fs.existsSync(dir))
    fs.mkdirSync(dir);
  const A2VModule = require('../../plugins/a2v/Music2Vibr.node');

  if (A2VModule === undefined)
    return;

  const out = await A2VModule.convert(`"${filePath}"`, `"${dir}"`);

  const base = path.basename(filePath, path.extname(filePath));
  log.info('M2V', out);
  try {
    await fsp.access(out, fs.constants.F_OK);
    // const context = await fsp.readFile(out);
    // if (context.length === 0)
    //   return;
    const ret = await loadHe(base, out);
    return ret;
  }
  catch (e) {
    log.error(`${MSG.M2V} error`, e);
    return;
  }
})


ipcMain.handle(MSG.LOAD_LIB, async (event, projName, name) => {
  log.info(MSG.LOAD_LIB, name);
  if (!LibraryManager.getInstance().hasLib(name))
    return;
  try {
    const lib = LibraryManager.getInstance().getLib(name);

    const audio = await importAudio(projName, lib!.audio);
    // log.info('audio loaded',audio);
    const he = await loadHe(name, lib!.vibration);
    // log.info('he loaded', he);
    if (isUndefined(audio) || isUndefined(he)) {
      log.error("library load failed")
      return;
    }
    const ret: IpcImportLibProps = {
      audio: audio,
      vibration: he,
    }
    return Promise.resolve(ret);
  } catch (error) {
    log.info(MSG.LOAD_LIB, error);
  }
  return;
})

ipcMain.handle(MSG.LIST_LIB_ON_TYPE, async (event, name) => {
  return LibraryManager.getInstance().listTypeLibrarys(name);
})

ipcMain.handle(MSG.GET_LIB_INFO, async (event, name) => {
  return LibraryManager.getInstance().getLib(name);
})

ipcMain.handle(MSG.LIST_LIB, async (event) => {
  return LibraryManager.getInstance().listLibrarys();
})

ipcMain.handle(MSG.LIST_LIB_TYPE, async (event) => {
  return LibraryManager.getInstance().listTypes();
})

ipcMain.handle(MSG.LOC_AUDIO, async (event, fullname, projName) => {
  const newPath = await getAudioPath(fullname);
  if (newPath === fullname)
    return;
  return await importAudio(projName, newPath);
})

export { win };
