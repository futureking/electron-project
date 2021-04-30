import { app, dialog, OpenDialogOptions } from "electron";
import { promises as fs } from 'fs'
import * as path from 'path';

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

export async function openProject() {
  try {
    const dialogRet = await dialog.showOpenDialog(importRtcpOptions);
    if (dialogRet.canceled || dialogRet.filePaths.length === 0)
      return;
    const readRet = await fs.readFile(dialogRet.filePaths[0]);
    if (readRet.length === 0)
      return;
    return Promise.resolve({ 
      name: path.basename(dialogRet.filePaths[0], PROJ_EXT), 
      url: dialogRet.filePaths[0], 
      data: readRet.toString() });
  } catch (error) {
    console.log(error);
  }
  return;
}

export async function saveProject(name:string, url: string, stream: string) {
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
      let file = await fs.stat(url);
      if (!file.isFile() || path.extname(url) !== PROJ_EXT) {
        return;
      }
    }
    await fs.writeFile(url, stream);
    return Promise.resolve({
      name: path.basename(url, PROJ_EXT),
      url: url
    });
  } catch (error) {
    console.error(error);
  }
  return;
}