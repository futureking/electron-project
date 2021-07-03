import { getSnapshot } from 'mobx-state-tree';
import { message } from 'antd';
import store, { undoManager } from '@/stores';
import { EXPORT_HE, IMPORT_AUDIO, SAVE_PROJ } from '@/../share/define/message';
import { TOTAL } from '@/../share/define/settings';
import { IpcImportAudioProps } from '@/../share/define/ipc';
import { formatHe, transientDuration } from "@/utils/he-utils";
import { isNull, isUndefined } from "lodash";
const { ipcRenderer } = window;

export function getTime(): number {
  let end = 0;
  const tab = store.currentTab;
  if (tab) {
    let delta = 0;
    switch (tab.type) {
      case 'Group':
        delta = store.currentGroup!.start;
        break;
      case 'A2V':
        delta = store.currentA2V!.start;
        break;
    }
    if (store.selection.indType === 'Time'/* && store.selector.start != 0*/) {
      // add at selector start
      end = store.selector.start + delta;
    }
    else {
      switch (tab.type) {
        case 'Root':
          end = store.current!.end + delta;
          break;
        case 'Group':
          const group = store.currentGroup;
          end = (group.count > 0 ? group!.duration : 0) + delta;
          break;
        case 'A2V':
          const a2v = store.currentA2V;
          end = (a2v.count > 0 ? a2v!.duration : 0) + delta;
          break;
      }
    }
  }
  return end;
}

export function saveProject(url?: string) {
  const project = store.current;
    let snapshot = getSnapshot(project!);
    let stream = JSON.stringify(snapshot);
    ipcRenderer.invoke(SAVE_PROJ, project!.id, project!.name, url ? url : '', stream).then(r => {
      if (typeof r === 'undefined')
        return;
      project!.setName(r.name);
      project!.setUrl(r.url);
      project!.setId(r.id);
    });
}

export function canAddEvent(time: number, duration: number) {
  const tab = store.currentTab;
  const project = store.current;

  if (!isUndefined(tab) && !isUndefined(project)) {
    const max = store.selection.indType === 'Time'? store.selector.end : project.end;
    if (max + duration <= TOTAL) {
      switch (tab.type) {
        case 'Root':
          return store.current!.canAdd(time);
        case 'Group':
          return store.currentGroup!.canAdd(time);
        case 'A2V':
          return store.currentA2V!.canAdd(time);
        default:
          return true;
      }
    }
  }
  return false;
}

export function canAddPkg(time: number, duration: number) {
  const tab = store.currentTab;
  const project = store.current;
  if (!isUndefined(tab) && !isUndefined(project)) {
    if (project.end + duration <= TOTAL) {
      switch (tab.type) {
        case 'Root':
          return store.current!.canAdd(time);
        default:
          return false;
      }
    }
  }
  return false;
}

export function addTransient(time: number) {
  const tab = store.currentTab;
  if (tab) {
    const space = transientDuration(50);
    switch (tab.type) {
      case 'Root':
        store.current!.makesureLegal(time, space);
        store.current!.addTransient(100, 50, 0, time);
        break;
      case 'Group':
        const group = store.currentGroup;
        if (group) {
          // store.current!.makesureLegal(time, space, group.id);
          if (group.count === 0) {
            time = group.start;
          }
          group.makesureLegal(time, space);
          group.addTransient(100, 50, 0, time - group.start);
        }
        break;
      case 'A2V':
        const a2v = store.currentA2V;
        if (a2v) {
          // store.current!.makesureLegal(time, space, a2v.id);
          if (a2v.count === 0) {
            time = a2v.start;
          }
          a2v.makesureLegal(time, space);
          a2v.addTransient(100, 50, 0, time - a2v.start);
        }
        break;

    }
  }
}

export function addContinuous(time: number) {
  const tab = store.currentTab;
  if (tab) {
    switch (tab.type) {
      case 'Root':
        store.current!.makesureLegal(time, 200);
        store.current!.addContinuous(200, 100, 50, 0, time);
        break;
      case 'Group':
        const group = store.currentGroup;
        if (group) {
          // store.current!.makesureLegal(time, 200, group.id);
          group.makesureLegal(time, 200);
          group.addContinuous(200, 100, 50, 0, time - group.start);
        }
        break;
      case 'A2V':
        const a2v = store.currentA2V;
        if (a2v) {
          // store.current!.makesureLegal(time, 200, a2v.id);
          a2v.makesureLegal(time, 200);
          a2v.addContinuous(200, 100, 50, 0, time - a2v.start);
        }
        break;
    }
  }
}

export function addGroup(time: number) {
  const tab = store.currentTab;
  const project = store.current;
  if (!isUndefined(tab) && !isUndefined(project)) {
    if (tab.type === 'Root') {
      project.makesureLegal(time, 100);
      project.addGroup('', time);
    }
  }
}


export function exportHe() {
  let stream = formatHe();
  ipcRenderer.send(EXPORT_HE, stream);
};

export function setRepeat() {
  const tab = store.currentTab;
  if (tab) {
    switch (tab.type) {
      case 'Root':
        let focus;
        switch (store.selection.focusType) {
          case 'Event':
            focus = store.focusEvent;
            if (!!focus) {
              focus.setRepeatEditable(true);
              store.selection.selectRepeat('Event', focus.id);
            }
            break;
          case 'Group':
            focus = store.focusGroup;
            if (!!focus) {
              focus.setRepeatEditable(true);
              store.selection.selectRepeat('Group', focus.id);
            }
            break;
          case 'A2V':
            focus = store.focusA2V;
            if (!!focus) {
              focus.setRepeatEditable(true);
              store.selection.selectRepeat('A2V', focus.id);
            }
            break;
        }
        break;
      case 'Group':
      case 'A2V':
        if (store.selection.focusType === 'Event') {
          let focus = store.focusEvent;
          if (focus) {
            focus.setRepeatEditable(true);
            store.selection.selectRepeat('Event', focus.id);
          }
        }
        break;
    }
  }
}

export function setCurve() {
  if (store.current && store.selection.focusType === 'Event') {
    let focus = store.focusEvent;
    if (!!focus) {
      focus.setCurveEditable(true);
    }
  }
}

export function importAudio(filePath: string) {
  ipcRenderer.invoke(IMPORT_AUDIO, filePath, store.current!.name).then(r => {
    if (isUndefined(r))
      return;
    let res = r as IpcImportAudioProps;
    store.current!.setBackground(res.name, res.src, res.wav, res.data, res.rate, res.duration, res.samples);
  })
};

// export function importBackgroundMusic (path: string) {
//   ipcRenderer.invoke(IMPORT_AUDIO, path, store.current!.name).then((r) => {
//     if (typeof r === 'undefined')
//       return;
//     let res = r as IpcImportAudioProps;
//     store.current!.setBackground(res.name, res.url, res.data, res.rate, res.duration, res.samples);
//   })
// };

export function execDelete() {
  const tab = store.currentTab;
  const project = store.current;

  if (isUndefined(tab) || isUndefined(project))
    return;

  const deleteid = store.selection.focusid;
  switch (store.selection.focusType) {
    case 'Event':
      if (tab.type === 'Root') {
        store.selection.selectRoot();
        project.deleteEvent(deleteid);
      }
      else if (tab.type === 'Group') {
        store.selection.selectGroup(tab.contentid);
        store.currentGroup!.deleteEvent(deleteid);
      }
      else if (tab.type === 'A2V') {
        store.selection.selectA2V(tab.contentid);
        store.currentA2V!.deleteEvent(deleteid);
      }
      break;
    case 'Group':
      if (tab.type === 'Root') {
        store.selection.selectRoot();
        project.deleteGroup(deleteid);
      }
      break;
    case 'A2V':
      if (tab.type === 'Root') {
        store.selection.selectRoot();
        project.deleteA2V(deleteid);
      }
      break;
    case 'Event-Repeat':
      store.selection.selectEvent(deleteid);
      store.focusEvent!.resetRepeat();
      break;
    case 'Group-Repeat':
      store.selection.selectGroup(deleteid);
      store.focusGroup!.resetRepeat();
      break;
    case 'A2V-Repeat':
      store.selection.selectA2V(deleteid);
      store.focusA2V!.resetRepeat();
      break;
    case 'Background':
      store.selection.selectRoot();
      project.clearBackground();
      break;
  }
}

export function calcEnabledMinTForEvent(time: number) {
  const tab = store.currentTab;
  let min = 0;
  if (!isUndefined(tab)) {
    switch (tab.type) {
      case 'Root':
        const project = store.current;
        if (!isUndefined(project)) {
          project.events.forEach(event => {
            const e = event.endWithRepeat;
            if (!isUndefined(e) && e <= time)
              min = Math.max(min, e);
          });
          project.groups.forEach(group => {
            const e = group.endWithRepeat;
            if (!isUndefined(e) && e <= time)
              min = Math.max(min, e);
          });
          project.a2vs.forEach(a2v => {
            const e = a2v.endWithRepeat;
            if (!isUndefined(e) && e <= time)
              min = Math.max(min, e);
          });
        }
        break;
      case 'Group':
        const group = store.currentGroup;
        if (!isUndefined(group)) {
          group.events.forEach(event => {
            const e = event.endWithRepeat;
            if (!isUndefined(e) && e <= time)
              min = Math.max(min, e);
          });
        }
        break;
      case 'A2V':
        const a2v = store.currentA2V;
        if (!isUndefined(a2v)) {
          a2v.events.forEach(event => {
            const e = event.endWithRepeat;
            if (!isUndefined(e) && e <= time)
              min = Math.max(min, e);
          });
        }
        break;
    }
  }
  return min;
}

export function calcEnabledMaxTForEvent(time: number) {
  const tab = store.currentTab;
  let max = 10 * 60 * 1000;
  if (!isUndefined(tab)) {
    switch (tab.type) {
      case 'Root':
        const project = store.current;
        if (!isUndefined(project)) {
          project.events.forEach(event => {
            const e = event.relativeTime;
            if (!isNull(e) && e >= time)
              max = Math.min(max, e);
          });
          project.groups.forEach(group => {
            const e = group.start;
            if (!isNull(e) && e >= time)
              max = Math.min(max, e);
          });
          project.a2vs.forEach(a2v => {
            const e = a2v.start;
            if (!isNull(e) && e >= time)
              max = Math.min(max, e);
          });
        }
        break;
      case 'Group':
        const group = store.currentGroup;
        if (!isUndefined(group)) {
          group.events.forEach(event => {
            const e = event.relativeTime;
            if (!isNull(e) && e >= time)
              max = Math.min(max, e);
          });
        }
        break;
      case 'A2V':
        const a2v = store.currentA2V;
        if (!isUndefined(a2v)) {
          a2v.events.forEach(event => {
            const e = event.relativeTime;
            if (!isNull(e) && e >= time)
              max = Math.min(max, e);
          });
        }
        break;
    }
  }
  return max;
}

export function calcEnabledMinTForPkg(time: number) {
  let min = 0;
  const project = store.current;
  if (!isUndefined(project)) {
    project.events.forEach(event => {
      const e = event.endWithRepeat;
      if (!isUndefined(e) && e <= time)
        min = Math.max(min, e);
    });
    project.groups.forEach(group => {
      const e = group.endWithRepeat;
      if (!isUndefined(e) && e <= time)
        min = Math.max(min, e);
    });
    project.a2vs.forEach(a2v => {
      const e = a2v.endWithRepeat;
      if (!isUndefined(e) && e <= time)
        min = Math.max(min, e);
    });
  }
  return min;
}

export function calcEnabledMaxTForPkg(time: number) {
  let max = 10 * 60 * 1000;
  const project = store.current;
  if (!isUndefined(project)) {
    project.events.forEach(event => {
      const e = event.relativeTime;
      if (!isNull(e) && e >= time)
        max = Math.min(max, e);
    });
    project.groups.forEach(group => {
      const e = group.start;
      if (!isNull(e) && e >= time)
        max = Math.min(max, e);
    });
    project.a2vs.forEach(a2v => {
      const e = a2v.start;
      if (!isNull(e) && e >= time)
        max = Math.min(max, e);
    });
  }
  return max;
}

export function calcNextBeginInRoot(time: number) {
  let max = 10 * 60 * 1000;
  const project = store.current;
  if (!isUndefined(project)) {
    project.events.forEach(event => {
      const e = event.relativeTime;
      if (!isNull(e) && e >= time)
        max = Math.min(max, e);
    });
    project.groups.forEach(group => {
      const e = group.start;
      if (!isNull(e) && e >= time)
        max = Math.min(max, e);
    });
    project.a2vs.forEach(a2v => {
      const e = a2v.start;
      if (!isNull(e) && e >= time)
        max = Math.min(max, e);
    });
  }
  return max;
}

export function calcNextBeginInPkg(pkg: any, time: number) {
  let max = 10 * 60 * 1000;
  pkg.events.forEach(event => {
    const e = event.relativeTime;
    if (!isNull(e) && e >= time)
      max = Math.min(max, e);
  });
  return max;
}

export function createProject() {
  let project = store.addProject('', 'Basic');
  const name = `${project.name}(${project.type})`;
  const tabid = store.addTab(project.id, name);
  store.selection.changeTab(tabid);
  store.selection.selectRoot();
  store.selector.reset();
}

export function Copy() {
  const tab = store.currentTab;
  const id = store.selection.focusid;
  if (tab!.type === 'Root') {
    if (store.selection.focusType === 'Event') {
      const copied = store.current!.copyEvent(id);
      const duration = store.focusEvent!.durationWithRepeat;
      if (copied != '') {
        store.selection.setPasteObj({ json: copied, src: 'copy', duration: duration, type: 'Event' })
      }
    }
    else if (store.selection.focusType === 'Group') {
      const copied = store.current!.copyGroup(id);
      const duration = store.focusGroup!.durationWithRepeat;
      if (copied != '') {
        store.selection.setPasteObj({ json: copied, src: 'copy', duration: duration, type: 'Group' })
      }
    }
    else if (store.selection.focusType === 'A2V') {
      const copied = store.current!.copyA2V(id);
      const duration = store.focusA2V!.durationWithRepeat;
      if (copied != '') {
        store.selection.setPasteObj({ json: copied, src: 'copy', duration: duration, type: 'A2V' })
      }
    }
  }
  else if (tab!.type === 'Group') {
    if (store.selection.focusType === 'Event') {
      const copied = store.currentGroup!.copyEvent(id);
      const duration = store.focusEvent!.durationWithRepeat;
      if (copied != '') {
        store.selection.setPasteObj({ json: copied, src: 'copy', duration: duration, type: 'Event' })
      }
    }
  }
  else if (tab!.type === 'A2V') {
    if (store.selection.focusType === 'Event') {
      const copied = store.currentA2V!.copyEvent(id);
      const duration = store.focusEvent!.durationWithRepeat;
      if (copied != '') {
        store.selection.setPasteObj({ json: copied, src: 'copy', duration: duration, type: 'Event' })
      }
    }
  }
}

export function Cut() {
  const tab = store.currentTab;
  const id = store.selection.focusid;
  if (tab!.type === 'Root') {
    if (store.selection.focusType === 'Event') {
      const copied = store.current!.copyEvent(id);
      const duration = store.focusEvent!.durationWithRepeat;
      if (copied != '') {
        store.selection.setPasteObj({ json: copied, src: 'cut', duration: duration, type: 'Event' })
        store.current!.deleteEvent(id);
        store.selection.selectRoot();
      }
    }
    else if (store.selection.focusType === 'Group') {
      const copied = store.current!.copyGroup(id);
      const duration = store.focusGroup!.durationWithRepeat;
      if (copied != '') {
        store.selection.setPasteObj({ json: copied, src: 'cut', duration: duration, type: 'Group' })
        store.current!.deleteGroup(id);
        store.selection.selectRoot();
      }
    }
    else if (store.selection.focusType === 'A2V') {
      const copied = store.current!.copyA2V(id);
      const duration = store.focusA2V!.durationWithRepeat;
      if (copied != '') {
        store.selection.setPasteObj({ json: copied, src: 'cut', duration: duration, type: 'A2V' })
        store.current!.deleteA2V(id);
        store.selection.selectRoot();
      }
    }
  }
  else if (tab!.type === 'Group') {
    if (store.selection.focusType === 'Event') {
      const group = store.currentGroup;
      if (isUndefined(group)) return;
      const copied = group.copyEvent(id);
      const duration = store.focusEvent!.durationWithRepeat;
      if (copied != '') {
        store.selection.setPasteObj({ json: copied, src: 'cut', duration: duration, type: 'Event' })
        group.deleteEvent(id);
        store.selection.selectGroup(group.id);
      }
    }
  }
  else if (tab!.type === 'A2V') {
    if (store.selection.focusType === 'Event') {
      const a2v = store.currentA2V;
      if (isUndefined(a2v)) return;
      const copied = a2v.copyEvent(id);
      const duration = store.focusEvent!.durationWithRepeat;
      if (copied != '') {
        store.selection.setPasteObj({ json: copied, src: 'cut', duration: duration, type: 'Event' })
        a2v.deleteEvent(id);
        store.selection.selectA2V(a2v.id);
      }
    }
  }
}

export function Paste() {
  const tab = store.currentTab;
  const pasteObj = store.selection.pasteObj;
  if (!!tab && !!pasteObj && pasteObj.json !== '') {
    undoManager.get(tab.rootid).startGroup(() => {
      let t = getTime();
      switch (pasteObj.type) {
        case 'Event':
          if (canAddEvent(t, pasteObj.duration)) {
            if (tab.type === 'Root') {
              store.current!.makesureLegal(t, pasteObj.duration);
              store.current!.pasteEvent(pasteObj.json, t, pasteObj.src);
            }
            else if (tab.type === 'Group') {
              const group = store.currentGroup;
              if (!isUndefined(group)) {
                group.makesureLegal(group.count === 0 ? group.start : t, pasteObj.duration);
                group.pasteEvent(pasteObj.json, t - group.start, pasteObj.src);
              }
            }
            else if (tab.type === 'A2V') {
              const a2v = store.currentA2V;
              if (!isUndefined(a2v)) {
                a2v.makesureLegal(a2v.count === 0 ? a2v.start : t, pasteObj.duration);
                a2v.pasteEvent(pasteObj.json, t - a2v.start, pasteObj.src);
              }
            }
          }
          else
            message.error(`Current time ${t} can't paste event`);
          break;
        case 'Group':
          if (tab.type === 'Root') {
            if (canAddPkg(t, pasteObj.duration)) {
              store.current!.makesureLegal(t, pasteObj.duration);
              store.current!.pasteGroup(pasteObj.json, t, pasteObj.src);
            }
            else
              message.error(`Current time ${t} can't paste group`);
          }
          break;
        case 'A2V':
          if (tab.type === 'Root') {
            if (canAddPkg(t, pasteObj.duration)) {
              store.current!.makesureLegal(t, pasteObj.duration);
              store.current!.pasteA2V(pasteObj.json, t, pasteObj.src);
            }
            else
              message.error(`Current time ${t} can't paste a2v`);
          }
          break;
      }
    });
    undoManager.get(tab.rootid).stopGroup();
  }
}