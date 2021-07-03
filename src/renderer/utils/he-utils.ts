import * as richtap from "@/../share/data/IRichTap";
import { IpcImportAudioProps } from "@/../share/define/ipc";
import { TOTAL } from "@/../share/define/settings";
import store, { undoManager } from "@/stores";
import dayjs from 'dayjs';
import { cloneDeep, isNull, isUndefined } from "lodash";
import { message } from 'antd';
// function sort(event: any) {
//   return event.sort((a: any, b: any) => (a.relativeTime > b.relativeTime ? 1 : a.relativeTime === b.relativeTime ? 0 : -1));
// }

export function transientDuration(frequency: number) {
  let duration = 0;
  if (frequency >= 0 && frequency <= 4)
    duration = 41;
  else if (frequency >= 5 && frequency <= 13)
    duration = 32;
  else if (frequency >= 14 && frequency <= 22)
    duration = 31;
  else if (frequency >= 23 && frequency <= 33)
    duration = 28;
  else if (frequency >= 34 && frequency <= 40)
    duration = 26;
  else if (frequency >= 41 && frequency <= 49)
    duration = 23;
  else if (frequency >= 50 && frequency <= 59)
    duration = 22;
  else if (frequency >= 60 && frequency <= 68)
    duration = 18;
  else if (frequency >= 69 && frequency <= 77)
    duration = 15;
  else if (frequency >= 78 && frequency <= 86)
    duration = 12;
  else if (frequency >= 87 && frequency <= 100)
    duration = 11;
  return duration;
}

function addHeAs(parent: any, obj: richtap.HeV1 | richtap.HeV2) {
  if (obj.Metadata.Version === 1) {
    (obj as richtap.HeV1).Pattern.map((value) => {
      switch (value.Event.Type) {
        case richtap.EventType.Transient:
          parent!.addTransient(
            value.Event.Parameters.Intensity, value.Event.Parameters.Frequency, value.Event.Index, value.Event.RelativeTime
          );
          break;
        case richtap.EventType.Continuous:
          const id = parent!.addContinuous(
            value.Event.Duration, value.Event.Parameters.Intensity, value.Event.Parameters.Frequency,
            value.Event.Index, value.Event.RelativeTime, value.Event.Parameters.Curve
          );
          parent!.events.get(id)!.setCurveEditable(true);
          break;
      }
    })
  }
  else if (obj.Metadata.Version === 2) {
    (obj as richtap.HeV2).PatternList.map(pattern => {
      const t = pattern.AbsoluteTime;
      pattern.Pattern.map(value => {
        switch (value.Event.Type) {
          case richtap.EventType.Transient:
            parent!.addTransient(
              value.Event.Parameters.Intensity, value.Event.Parameters.Frequency, value.Event.Index, value.Event.RelativeTime + t
            );
            break;
          case richtap.EventType.Continuous:
            const id = parent!.addContinuous(
              value.Event.Duration, value.Event.Parameters.Intensity, value.Event.Parameters.Frequency,
              value.Event.Index, value.Event.RelativeTime + t, value.Event.Parameters.Curve
            );
            parent!.events.get(id)!.setCurveEditable(true);
            break;
        }
      })
    })
  }
}

export function addHeAsGroup(t: number, name: string, obj: richtap.HeV1 | richtap.HeV2, audio?: IpcImportAudioProps) {
  const project = store.current;
  if (isUndefined(project)) return;
  const max = store.selection.indType === 'Time' ? store.selector.end : project.end;
  const gid = project.addGroup(name, t, audio);
  const group = project.groups.get(gid);
  if (group) {
    addHeAs(group, obj);
    console.log(`add ${group.count} events to group`);
    if (max + group.duration <= TOTAL) {
      project.makesureLegal(t, group.duration);
      group.setStart(t);
    }
    else {
      project.deleteGroup(gid);
      message.error(`No enough space to load he file for duration ${group.duration} ms at time ${t}`);
    }
  }
}

export function addHeAsA2V(t: number, name: string, obj: richtap.HeV1 | richtap.HeV2, audio: IpcImportAudioProps) {
  const project = store.current;
  if (isUndefined(project)) return;
  const max = store.selection.indType === 'Time' ? store.selector.end : project.end;
  const aid = project.addA2V(name, t, audio);
  const a2v = project.a2vs.get(aid);
  if (a2v) {
    addHeAs(a2v, obj);
    console.log(`add ${a2v.count} events to a2v`);
    if (max + a2v.duration <= TOTAL) {
      project.makesureLegal(t, a2v.duration);
      a2v.setStart(t);
    }
    else {
      project.deleteA2V(aid);
      message.error(`No enough space to convert audio for duration ${a2v.duration} ms at time ${t}`);
    }
  }
}

export function ResetA2v(a2v: any, name: string, obj: richtap.HeV1 | richtap.HeV2, audio: IpcImportAudioProps) {
  const project = store.current;
  if (isUndefined(project)) return;

  const originD = a2v.durationWithRepeat;
  const originID = a2v.id;
  const originT = a2v.start;
  const newA2V = project.createA2V(originID, name, originT, audio, a2v.repeat.times, a2v.repeat.interval)
  addHeAs(newA2V, obj);
  const space = newA2V.durationWithRepeat - originD;
  if (TOTAL < project.endWithRepeat + space)
    return;
  undoManager.get(project.id).startGroup(() => {
    project.deleteA2V(originID)
    project.makesureLegal(originT, space, originID);
    project.resetA2V(originID, newA2V);
  });
  undoManager.get(project.id).stopGroup();
}

export function formatHe() {
  const tab = store.currentTab;
  if (isUndefined(tab))
    return;

  let validEvents: Array<any> = new Array<any>();
  let validEventCount: number = 0;
  const head = 'Export from RichTap Creator Pro';
  let msg: string = "";
  switch (tab.type) {
    case 'Root':
      const project = store.current;
      if (isNull(project) || isUndefined(project))
        return;
      msg = `${head} for ${project.name}`;
      project.validBaseEvent.map(event => {
        for (let i = 0; i < event.repeat.times; i++) {
          const t = cloneDeep(event);
          t.relativeTime += (t.duration + t.repeat.interval) * i;
          validEvents.push(t);
        }
      });
      project.groups.forEach(group => {
        for (let i = 0; i < group.repeat.times; i++) {
          const delta = (group.repeat.interval + group.duration) * i + group.start;
          group.validEvents.map(event => {
            for (let j = 0; j < event.repeat.times; j++) {
              const t = cloneDeep(event);
              t.relativeTime += (t.duration + t.repeat.interval) * j + delta;
              validEvents.push(t);
            }
          });
        }
      });
      project.a2vs.forEach(a2v => {
        for (let i = 0; i < a2v.repeat.times; i++) {
          const delta = (a2v.repeat.interval + a2v.duration) * i + a2v.start;
          a2v.validEvents.map(event => {
            for (let j = 0; j < event.repeat.times; j++) {
              const t = cloneDeep(event);
              t.relativeTime += (t.duration + t.repeat.interval) * j + delta;
              validEvents.push(t);
            }
          });
        }
      });
      break;
    case 'Group':
      const group = store.currentGroup;
      if (isNull(group) || isUndefined(group))
        return;
      msg = `${head} for ${group.name}`;
      group.validEvents.map(event => {
        for (let i = 0; i < event.repeat.times; i++) {
          const t = cloneDeep(event);
          t.relativeTime += (t.duration + t.repeat.interval) * i;
          validEvents.push(t);
        }
      });
      break;
    case 'A2V':
      const a2v = store.currentA2V;
      if (isNull(a2v) || isUndefined(a2v))
        return;
      msg = `${head} for ${a2v.name}`;
      a2v.validEvents.map(event => {
        for (let i = 0; i < event.repeat.times; i++) {
          const t = cloneDeep(event);
          t.relativeTime += (t.duration + t.repeat.interval) * i;
          validEvents.push(t);
        }
      });
      break;
  }
  validEventCount = validEvents.length;

  if (validEventCount === 0)
    return;
  const pattrenListCount = Math.ceil(validEventCount / 16);
  let count = 0;
  console.log(`format ${validEventCount} events into ${pattrenListCount} pattrenList`);

  let pattrenList = new Array<richtap.PatternItem>();
  let meta = new richtap.Metadata(2, dayjs().format('YYYY-MM-DD'), msg);

  let eventList: Array<richtap.IEventItem>;
  let absolutetime: number = 0;
  validEvents.map((event) => {
    if (count % 16 === 0) {
      absolutetime = event.relativeTime;
      eventList = new Array<richtap.IEventItem>();
    }
    let curve;
    if (event.type === 'Continuous' && event.curve !== null) {
      curve = new Array<richtap.CurvePoint>();
      event.curve.map(p => {
        curve!.push(new richtap.CurvePoint(p.time, p.intensity, p.frequency));
      });
    }
    let param = new richtap.Parameters(event.intensity, event.frequency, curve);

    let e = new richtap.Event(event.type.toLowerCase(), event.relativeTime - absolutetime, event.index, param, event.duration!);

    eventList!.push(new richtap.EventItem(e));
    if (count % 16 === 15 || count === validEventCount - 1) {
      let pattren = new richtap.PatternItem(absolutetime, eventList!);
      pattrenList.push(pattren);
    }
    count++;
  });
  let he = new richtap.HeV2(meta, pattrenList);

  return JSON.stringify(he, (k, v) => {
    if (k === 'Type')
      return richtap.EventType[v].toString().toLowerCase();
    else
      return v;
  }, 4);
}