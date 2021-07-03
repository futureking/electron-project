import { randomUuid } from '@/utils/utils';
import { getSnapshot, types } from 'mobx-state-tree';
import { Event, valid } from './events';
import { Group } from './group';
import { ICurvePoint } from '@/../share/data/IRichTap';
import { values } from 'mobx';
import Audio from './audio';
import { Repeat } from './repeat';

import { setUndoManager } from './index';
import AudioVibration from './a2v';
import { IpcImportAudioProps } from '@/../share/define/ipc';
import { transientDuration } from '@/utils/he-utils';
import { isNull, isUndefined } from 'lodash';


const Project = types
  .model({
    id: types.identifier,
    name: types.string,
    url: types.string,
    type: types.enumeration(['Basic', 'Stereo']),
    events: types.map(Event),
    groups: types.map(Group),
    a2vs: types.map(AudioVibration),
    background: types.maybeNull(Audio),
  })
  .views(self => ({
    get eventCount() {
      return self.events.size;
    },
    get groupCount() {
      return self.groups.size;
    },
    get a2vCount() {
      return self.a2vs.size;
    },

    get totalEventCount() {
      let ret = this.eventCount;
      if (this.groupCount > 0) {
        self.groups.forEach(g => {
          ret += g.count;
        });
      }
      if (this.a2vCount > 0) {
        self.a2vs.forEach(a => {
          ret += a.count;
        });
      }
      return ret;
    },
    get validBaseEvent() {
      if (this.eventCount === 0)
        return [];
      return valid(values(self.events));
    },
    // get validBaseEventCount() {
    //   return this.validBaseEvent.length;
    // },
    // get allEvents() {
    //   let events = new Array<any>();
    //   if (self.events.size > 0) {
    //     events.push(...this.validBaseEvent);
    //   }
    //   if (self.groups.size > 0) {
    //     self.groups.forEach(g => {
    //       events.push(...g.validEventsAbs);
    //     })
    //   }
    //   return events;
    // },
    get end() {
      let max = 0;
      if (this.eventCount > 0) {
        self.events.forEach((event) => {
          const end = event.endWithRepeat;
          if (!isUndefined(end)) {
            max = end > max ? end : max;
          }
        })
      }
      if (this.groupCount > 0) {
        self.groups.forEach((group) => {
          const end = group.endWithRepeat;
          max = end > max ? end : max;
        });
      }
      if (this.a2vCount > 0) {
        self.a2vs.forEach((a2v) => {
          const end = a2v.endWithRepeat;
          max = end > max ? end : max;
        });
      }
      return max;
    },
    canAdd(t: number) {
      for (const [, v] of self.events) {
        if (!isNull(v.relativeTime) && !isUndefined(v.endWithRepeat) && v.relativeTime < t && v.endWithRepeat > t)
          return false;
      };
      for (const [, v] of self.groups) {
        if (v.start < t && v.endWithRepeat > t)
          return false;
      };
      for (const [, v] of self.a2vs) {
        if (v.start < t && v.endWithRepeat > t)
          return false;
      };
      return true;
    },
  }))
  .actions(self => {
    setUndoManager(self);
    return {
      setId(id: string) {
        self.id = id;
      },
      setName(name: string) {
        self.name = name;
      },
      setUrl(url: string) {
        self.url = url;
      },
      setBackground(name: string, src: string, tgt: string, data: Array<number>, rate: number, duration: number, samples: number) {
        self.background = Audio.create({
          name: name,
          path: src,
          target: tgt,
          rate: rate,
          samples: samples,
          data: data,
          duration: duration,
        });
        // self.background.data.replace(data);
      },
      clearBackground() {
        self.background = null;
      },
      addGroup(name: string, t: number, props?: IpcImportAudioProps): string {
        const id = randomUuid();
        if (name === '')
          name = `Group ${self.groupCount}`;
        let audio: any|null = null;
        if (!isUndefined(props))
          audio = Audio.create({
            name: name,
            path: props.src,
            target: props.wav,
            rate: props.rate,
            samples: props.samples,
            data: props.data,
            duration: props.duration,
          });
        const group = Group.create({
          id: id, name: name, start: t, audio: audio, events: {},
          repeat: Repeat.create({
            name: `Repeat for Group ${name}`,
            times: 1,
            interval: 0,
          }),
          repeateditable: false,
        });
        self.groups.set(id, group);
        return id;
      },
      addA2V(name: string, t: number, audio: IpcImportAudioProps) {
        const id = randomUuid();
        const a2v = AudioVibration.create({
          id: id, name: name, start: t, events: {},
          audio: Audio.create({
            name: name,
            path: audio.src,
            target: audio.wav,
            rate: audio.rate,
            samples: audio.samples,
            data: audio.data,
            duration: audio.duration,
          }),
          repeat: Repeat.create({
            name: `Repeat for A2V ${name}`,
            times: 1,
            interval: 0,
          }),
          repeateditable: false,
        });
        self.a2vs.set(id, a2v);
        return id;
      },
      createA2V(id: string, name: string, t: number, audio: IpcImportAudioProps, repeat:number, interval: number) {
        const a2v = AudioVibration.create({
          id: id, name: name, start: t, events: {},
          audio: Audio.create({
            name: name,
            path: audio.src,
            target: audio.wav,
            rate: audio.rate,
            samples: audio.samples,
            data: audio.data,
            duration: audio.duration,
          }),
          repeat: Repeat.create({
            name: `Repeat for A2V ${name}`,
            times: repeat,
            interval: interval,
          }),
          repeateditable: false,
        });
        return a2v;
      },
      resetA2V(id, a2v) {
        self.a2vs.set(id, a2v);
      },
      deleteGroup(id: string) {
        if (!self.groups.has(id))
          return;
        self.groups.delete(id);
      },
      deleteA2V(id: string) {
        if (self.a2vs.has(id)) {
          self.a2vs.delete(id);
        }
      },
      addTransient(intensity: number = 100, frequency: number = 50, index: number = 0, time?: number) {
        const id = randomUuid();
        const event = Event.create({
          id: id,
          name: `Transient ${self.totalEventCount}`,
          type: 'Transient',
          index: index,
          relativeTime: time,
          duration: transientDuration(frequency),
          intensity: intensity,
          frequency: frequency,
          curve: [],
          curveeditable: false,
          curveRatio: [],
          repeat: Repeat.create({
            name: `Repeat for Transient ${self.totalEventCount}`,
            times: 1,
            interval: 0,
          }),
          repeateditable: false,
        });
        self.events.set(id, event)
        return id;
      },
      addContinuous(duration: number = 200, intensity: number = 100, frequency: number = 50, index: number = 0, time?: number, curve?: Array<ICurvePoint>) {
        const id = randomUuid();
        const event = Event.create({
          id: id,
          name: `Continuous ${self.totalEventCount}`,
          type: 'Continuous',
          index: index,
          relativeTime: time,
          duration: duration,
          intensity: intensity,
          frequency: frequency,
          curve: [],
          curveeditable: false,
          curveRatio: [],
          repeat: Repeat.create({
            name: `Repeat for Continuous ${self.totalEventCount}`,
            times: 1,
            interval: 0,
          }),
          repeateditable: false,
        })
        if (!!curve && curve.length > 0) {
          curve.map((value: ICurvePoint) => {
            event.addCurvePoint(value.Time, value.Intensity, value.Frequency);
          })
        }
        else {
          event.addCurvePoint(0, 0, 0)
          event.addCurvePoint(1, 1, 0)
          event.addCurvePoint(duration - 1, 1, 0)
          event.addCurvePoint(duration, 0, 0)
        }
        self.events.set(id, event)
        return id;
      },
      deleteEvent(id: string) {
        if (self.events.has(id)) {
          self.events.delete(id);
        }
      },
      copyEvent(id: string) {
        if (self.events.has(id)) {
          const src = self.events.get(id);
          return JSON.stringify(getSnapshot(src!));
        }
        return '';
      },
      pasteEvent(json: string, t: number, type: string) {
        if (json !== '') {
          const src = JSON.parse(json);
          const nid = randomUuid();
          const ne = Event.create({ ...src, id: nid, relativeTime: t, name: `${src.name}${type==='copy'?'_copied':''}` });
          self.events.set(nid, ne);
        }
      },
      copyGroup(id: string) {
        if (self.groups.has(id)) {
          const src = self.groups.get(id);
          const snapshot = getSnapshot(src!);
          return JSON.stringify(snapshot);
        }
        return '';
      },
      pasteGroup(json: string, t: number) {
        if (json !== '') {
          const src = JSON.parse(json);
          const nid = randomUuid();
          const ne = Group.create({ ...src, id: nid, start: t, name: `${src.name}` });
          self.groups.set(nid, ne);
        }
      },
      copyA2V(id: string) {
        if (self.a2vs.has(id)) {
          const src = self.a2vs.get(id);
          const snapshot = getSnapshot(src!);
          return JSON.stringify(snapshot);
        }
        return '';
      },
      pasteA2V(json: string, t: number) {
        if (json !== '') {
          const src = JSON.parse(json);
          const nid = randomUuid();
          const ne = AudioVibration.create({ ...src, id: nid, start: t, name: `${src.name}` });
          self.a2vs.set(nid, ne);
        }
      },
      makesureLegal(t: number, space: number, expectid: string = '') {
        self.events.forEach(v => {
          if (v.relativeTime !== null && v.relativeTime >= t)
            v.relativeTime += space;
        });
        self.groups.forEach(v => {
          if (v.start >= t && (expectid === '' || v.id !== expectid)) {
            v.start += space;
          }
        });
        self.a2vs.forEach(v => {
          if (v.start >= t && (expectid === '' || v.id !== expectid))
            v.start += space;
        });
      }
    }
  })

export default Project;
