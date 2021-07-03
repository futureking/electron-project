import { app, dialog, OpenDialogOptions } from 'electron';
import { IpcImportAudioProps } from 'src/share/define/ipc';
import * as fs from 'fs';
const fspromises = fs.promises;
import * as path from 'path';
import { isUndefined } from 'lodash';

const log = require('electron-log');

const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const ffprobePath = require('ffprobe-static').path;
// log.warn('ffmpegPath', ffmpegPath.replace('app','app/node_modules/ffmpeg-static'));
// log.warn('ffprobePath', ffprobePath.replace('app','app/node_modules/ffprobe-static'));
// log.warn('isPackaged', app.isPackaged);

if (process.env.NODE_ENV !== 'development') {
  // ffmpeg.setFfmpegPath(ffmpegPath.replace('app.asar', 'node_modules\\ffmpeg-static'))
  // ffmpeg.setFfprobePath(ffprobePath.replace('app.asar', 'node_modules\\ffprobe-static'))
  ffmpeg.setFfmpegPath(ffmpegPath.replace('app', 'node_modules\\ffmpeg-static'));
  ffmpeg.setFfprobePath(ffprobePath.replace('app', 'node_modules\\ffprobe-static'));
} else {
  ffmpeg.setFfmpegPath(ffmpegPath)
  ffmpeg.setFfprobePath(ffprobePath)
}

function importAudioOptions(defaultPath?: string): OpenDialogOptions {
  return {
    title: "Select Audio file",
    buttonLabel: "OK",
    defaultPath: isUndefined(defaultPath) ? app.getPath('documents'): defaultPath,
    properties: ['openFile'],
    filters: [
      { name: 'Audio File Type', extensions: ['wav', 'mp3', 'ogg'] },
    ]
  }
};

export async function getAudioPath(defaultPath?: string): Promise<string> {
  const ret = await dialog.showOpenDialog(importAudioOptions(defaultPath));
  if (ret.canceled || ret.filePaths.length === 0)
    return '';
  else
    return ret.filePaths[0];
}

export async function importAudio(projName: string, audioPath: string) {
  log.info('importAudio', audioPath);
  if (audioPath === '')
    return;
  const duration = await getAudioInfo(audioPath);
  const [out1, out2] = await decoder(audioPath, projName, 2000);
  try {
    fspromises.access(out1, fs.constants.F_OK | fs.constants.R_OK);
    fspromises.access(out2, fs.constants.F_OK | fs.constants.R_OK);

    const buffer = await fspromises.readFile(out1);
    const iarray = new Int8Array(buffer);
    const array = new Array<number>();
    iarray.map(i => array.push(i));
    let res: IpcImportAudioProps = {
      name: path.basename(audioPath, path.extname(audioPath)),
      src: audioPath,
      wav: out2,
      data: array,
      rate: 2000,
      samples: Math.round(duration * 2000),
      duration: duration,
    };
    return Promise.resolve(res);
  }
  catch (err) {
    log.error('importAudio err', err);
    return;
  }
}

export async function loadWave(name: string) {
  return await streamToBlob(name);
}

async function getAudioInfo(name: string) {
  return new Promise<number>(resolve => {
    ffmpeg(name).ffprobe((err, data) => {
      // const channel = data.streams[0].channels ?? 0;
      // const fmt = data.streams[0].sample_fmt ?? '';
      // const rate = data.streams[0].sample_rate ?? 0;
      // const count = parseInt(data.streams[0].duration_ts ?? '0');
      // const duration = parseFloat(data.streams[0].duration ?? '0');
      // log.info(
      //   `
      // channel:${channel},\n
      // format:${fmt},\n
      // rate:${rate},\n
      // sample count:${count},\n
      // duration:${duration},\n
      // `
      // );
      // let res: AudioInfoProps = {
      //   channel: channel,
      //   format: fmt,
      //   rate: rate,
      //   sampleCount: count,
      //   duration: duration,
      // };
      if (err) {
        log.error('ffprobe failed', err.message);
      }
      // log.warn(data);
      resolve(data.format.duration ?? 0);
    });
  });
}


async function decoder(name: string, projName: string, rate: number) {
  const dir = path.join(app.getPath('userData'), projName);
  if (!fs.existsSync(dir))
    fs.mkdirSync(dir);
  const basename = path.basename(name, path.extname(name));
  const out1 = path.resolve(dir, basename + '.raw');
  const out2 = path.resolve(dir, basename + '.wav');
  return new Promise<[string, string]>((resolve, reject) => {
    ffmpeg(name)
      .on('end', async () => {
        resolve([out1, out2]);
      })
      .noVideo()
      .format('s8')
      // .audioCodec('pcm_s16le')
      .audioChannels(1)
      .audioFrequency(2000)
      .output(out1)
      .output(out2)
      .run()
  });
}


async function streamToBlob(name: string) {
  const buffer = fs.readFileSync(name);
  const array = new Uint8Array(buffer);
  return Promise.resolve(array);
}