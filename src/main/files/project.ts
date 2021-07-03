import { app, dialog, OpenDialogOptions } from "electron";
import fs, { promises as fsp } from 'fs'
import * as path from 'path';

const log = require('electron-log');

const Store = require('electron-store');
const fileStore = new Store({ name: 'Files Data' });

const importRtcpOptions: OpenDialogOptions = {
  title: "Select Rtcp file",
  buttonLabel: "OK",
  defaultPath: app.getPath('documents'),
  properties: ['openFile'],
  filters: [
    { name: 'RichTap Creator Project Type', extensions: ['rtcp'] },
  ]
};

// const exportRtcpOptions: SaveDialogOptions = {
//   defaultPath: app.getPath('documents'),
//   filters: [
//     { name: 'RichTap Creator Project Type', extensions: ['rtcp'] },
//   ]
// }

const PROJ_EXT = '.rtcp';

export async function getProjectPath() {
  const ret = await dialog.showOpenDialog(importRtcpOptions);
  if (ret.canceled || ret.filePaths.length === 0)
    return;
  else
    return ret.filePaths[0];
}

export async function openProject(filePath: string) {
  try {
    await fsp.access(filePath, fs.constants.F_OK | fs.constants.R_OK);
    const readRet = await fsp.readFile(filePath);
    if (readRet.length === 0)
      return;
    return Promise.resolve({
      name: path.basename(filePath, PROJ_EXT),
      url: filePath,
      data: readRet.toString()
    });
  }
  catch (e) {
    log.error('openProject error', e);
    return Promise.reject('openProject error');
  }
}

export async function saveProject(id: string, name: string, url: string, stream: string) {
  if (stream.length === 0)
    return;
  try {
    if (url === '') {
      const dialogRet = await dialog.showSaveDialog({
        defaultPath: path.format({
          dir: app.getPath('documents'),
          base: name + PROJ_EXT
        }),
        filters: [
          { name: 'RichTap Creator Project Type', extensions: ['rtcp'] },
        ]
      });
      if (dialogRet.canceled || typeof dialogRet.filePath === 'undefined')
        return;
      url = dialogRet.filePath;
    }
    else {
      let file = await fsp.stat(url);
      if (!file.isFile() || path.extname(url) !== PROJ_EXT) {
        return;
      }
    }
    await fsp.writeFile(url, stream);
    const files: any = fileStore.get('files') || {};
    const fileObj = { id, url, name, stream };
    fileStore.set('files', { ...files, [id]: fileObj });

    return Promise.resolve({
      name: path.basename(url, PROJ_EXT),
      url: url,
      id: id
    });
  } catch (e) {
    log.error('saveProject error', e);
  }
  return;
}
