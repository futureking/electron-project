import { app, dialog, OpenDialogOptions, SaveDialogOptions } from 'electron'
// import { IpcMainEvent } from 'electron/main'
import { promises as fs } from 'fs'
import path from 'path'
import { CurvePoint, EventItem, HeV1, HeV2, ICurvePoint, IEvent, Event, IEventItem, IHeV1, IHeV2, IMetadata, IParameters, IPatternItem, Metadata, Parameters, PatternItem } from '../../share/data/IRichTap'

const importHeOptions: OpenDialogOptions = {
  title: "Select He file",
  buttonLabel: "OK",
  defaultPath: app.getPath('desktop'),
  properties: ['openFile'],
  filters: [
    { name: 'RichTap File Type', extensions: ['he'] },
  ]
};

const exportHeOptions: SaveDialogOptions = {
  defaultPath: app.getPath('documents'),
  filters: [
    { name: 'RichTap File Type', extensions: ['he'] },
  ]
}

async function openFile(options: OpenDialogOptions) {
  return await dialog.showOpenDialog(options);
}

async function importHe() {
  try {
    const dialogRet = await openFile(importHeOptions);
    if (dialogRet.canceled || dialogRet.filePaths.length === 0)
      return;
    const readRet = await fs.readFile(dialogRet.filePaths[0]);
    if (readRet.length === 0)
      return;
    return await loadHe(dialogRet.filePaths[0], readRet.toString());
  } catch (error) {
    console.log(error);
  }
  return
}

async function loadHe(name: string, str: string) {
  let json = JSON.parse(str);
  if (verifyHe(json)) {
    let obj = parseHe(json);
    if (!!obj) {
      return Promise.resolve({
        version: obj.Metadata.Version,
        name: path.basename(name, '.he'),
        data: JSON.stringify(obj)
      });
    }
  }
  return Promise.reject('load failed');
}

async function exportHe(stream: string) {
  if (stream.length === 0)
    return;
  try {
    const dialogRet = await dialog.showSaveDialog(exportHeOptions);
    if (dialogRet.canceled || typeof dialogRet.filePath === 'undefined')
      return;
    await fs.writeFile(dialogRet.filePath, stream);
  } catch (error) {
    console.error(error);
  }
}

function checkKey(obj: Object, key: string, parentKey: string = ''): boolean {
  if (!obj.hasOwnProperty(key)) {
    console.log('Miss key ' + key + (parentKey === '' ? '' : (' in ' + parentKey)))
    return false
  }
  if (typeof (obj[key]) !== 'undefined' && obj[key] !== null) {
    return true
  }
  else {
    console.log(key + '\'s value is null')
    return false
  }
}

function verifyHe(obj: Object): boolean {
  let ret = checkKey(obj, 'Metadata')
  if (!ret)
    return ret

  let metadata = obj['Metadata']
  ret = checkKey(metadata, 'Version', 'Metadata') && checkKey(metadata, 'Description', 'Metadata') && checkKey(metadata, 'Created', 'Metadata')
  if (!ret)
    return ret

  let version = metadata['Version'];
  console.log('verify ver: ', version)
  if (version == 1) {
    return verifyPattern(obj, version);
  }
  else if (version == 2) {
    return verifyPatternList(obj, version);
  }
  else {
    return false;
  }
}

function verifyPatternList(obj: Object, ver: number): boolean {
  let ret = checkKey(obj, 'PatternList')
  if (!ret)
    return ret
  let patternList = obj['PatternList']
  if (!Array.isArray(patternList)) {
    console.log('Pattern type error')
    return false
  }
  for (let i = 0; i < patternList.length; i++) {
    let e: Object = patternList[i]
    ret = checkKey(e, 'AbsoluteTime')
    if (!ret)
      return ret
    return verifyPattern(e, ver)
  }
  return true
}

function verifyPattern(obj: Object, ver: number): boolean {
  let ret = checkKey(obj, 'Pattern')
  if (!ret)
    return ret

  let pattern = obj['Pattern'];
  if (!Array.isArray(pattern)) {
    console.log('Pattern type error')
    return false
  }
  if (pattern.length > 16) {
    console.log('Event count overrange:', pattern.length)
    return false
  }
  for (let i = 0; i < pattern.length; i++) {
    let e: Object = pattern[i]
    ret = checkKey(e, 'Event', 'Pattern')
    if (!ret)
      return ret

    return verifyEvent(e['Event'], ver)
  }
  return true;
}

function verifyEvent(obj: Object, ver: number): boolean {
  if (obj === {}) {
    console.log('Type:' + + ' error')
    return false
  }

  let ret = checkKey(obj, 'RelativeTime', 'Event')
  if (!ret)
    return ret
  ret = checkKey(obj, 'Type', 'Event')
  if (!ret)
    return ret
  let type = obj['Type']
  if (type !== 'transient' && type !== 'continuous') {
    console.log('Type:' + type + ' error')
    return false
  }
  if (type === 'continuous') {
    ret = checkKey(obj, 'Duration', 'Event')
    if (!ret)
      return ret
  }
  if (ver == 2) {
    ret = checkKey(obj, 'Index', 'Event')
    if (!ret)
      return ret
  }

  ret = checkKey(obj, 'Parameters', 'Event')
  if (!ret)
    return ret

  return verifyParam(obj['Parameters'], ver, (type === 'continuous'))
}

function verifyParam(obj: Object, ver: number, isContinuous: boolean): boolean {
  let ret = checkKey(obj, 'Frequency', 'Parameters')
  if (!ret)
    return ret
  ret = checkKey(obj, 'Intensity', 'Parameters')
  if (!ret)
    return ret
  if (isContinuous) {
    ret = checkKey(obj, 'Curve', 'Parameters')
    if (!ret)
      return ret
    let curve = obj['Curve']
    if (!Array.isArray(curve)) {
      console.log('Curve type error')
    }
    if (curve.length > (ver === 1 ? 4 : 16)) {
      console.log('Curve count overrange:', curve.length)
      return false
    }

    for (let i = 0; i < curve.length; i++) {
      let p: Object = curve[i]
      ret = checkKey(p, 'Time', 'Curve')
      if (!ret)
        return ret
      ret = checkKey(p, 'Intensity', 'Curve')
      if (!ret)
        return ret
      let intens_p = p['Intensity']
      if (intens_p < 0 || intens_p > 1) {
        console.log('CurvePonit ' + i + ' Intensity overrange:', intens_p)
        return false
      }
      ret = checkKey(p, 'Frequency', 'Curve')
      if (!ret)
        return ret
      let freq_p = p['Frequency']
      if (freq_p < -100 || freq_p > 100) {
        console.log('CurvePonit ' + i + ' Frequency overrange:', freq_p)
        return false
      }
    }
  }
  return true
}

function parseHe(json: Object): IHeV1 | IHeV2 | undefined {
  let metadata: IMetadata = parseMetadata(json['Metadata'])
  if (metadata.Version === 1) {
    let pattren = parsePattern(json['Pattern'])
    return new HeV1(metadata, pattren)
  }
  else if (metadata.Version == 2) {
    let pattrenList = new Array<IPatternItem>()
    json['PatternList'].map((value) => {
      pattrenList.push(parsePatternListItem(value))
    })
    pattrenList.sort(comparePattern)
    return new HeV2(metadata, pattrenList)
  }
  else
    return undefined;
}

function parseMetadata(obj: Object): IMetadata {
  return new Metadata(obj['Version'], obj['Created'], obj['Description'])
}

function parsePoint(obj: Object): ICurvePoint {
  return new CurvePoint(obj['Time'], obj['Intensity'], obj['Frequency'])
}

function parseCurve(obj: Array<Object>): Array<ICurvePoint> {
  let curves = new Array<ICurvePoint>()
  obj.map((value) => {
    curves.push(parsePoint(value))
  })
  curves.sort(compareCurvePoint)
  return curves
}

function parseParameters(obj: Object): IParameters {
  let curves = obj.hasOwnProperty('Curve') ? parseCurve(obj['Curve']) : undefined
  return new Parameters(obj['Intensity'], obj['Frequency'], curves)
}

function parseEvent(obj: Object): IEventItem {
  let param = parseParameters(obj['Parameters'])
  let duration: number | undefined = obj.hasOwnProperty('Duration') ? obj['Duration'] : undefined
  let event: IEvent = new Event(obj['Type'], obj['RelativeTime'], obj['Index'], param, duration)
  return new EventItem(event)
}

function parsePattern(obj: Array<Object>): Array<IEventItem> {
  let array = new Array<IEventItem>()
  obj.map((value) => {
    let event = parseEvent(value['Event']);
    array.push(event)
  })
  array.sort(compareEvent)
  return array
}

function parsePatternListItem(obj: Object): IPatternItem {
  let pattern = parsePattern(obj['Pattern'])
  return new PatternItem(obj['AbsoluteTime'], pattern)
}

function compareCurvePoint(a: ICurvePoint, b: ICurvePoint): number {
  if (a.Time < b.Time)
    return -1
  else if (a.Time > b.Time)
    return 1
  else
    return 0
}

function compareEvent(a: IEventItem, b: IEventItem): number {
  if (a.Event.RelativeTime < b.Event.RelativeTime)
    return -1
  else if (a.Event.RelativeTime > b.Event.RelativeTime)
    return 1
  else
    return 0
}

function comparePattern(a: IPatternItem, b: IPatternItem): number {
  if (a.AbsoluteTime < b.AbsoluteTime)
    return -1
  else if (a.AbsoluteTime > b.AbsoluteTime)
    return 1
  else
    return 0
}
export { importHe, exportHe, verifyHe, parseHe };