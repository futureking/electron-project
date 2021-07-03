import { values } from 'mobx';
import { getSnapshot, types } from "mobx-state-tree";
import { randomUuid, timeAtMin, timeAtMSec, timeAtSec } from '@/utils/utils';
import { Event, valid, sorted } from './events';
import Audio from './audio';
import { Repeat } from "./repeat";
import { ICurvePoint } from '@/../share/data/IRichTap';
import { transientDuration } from '@/utils/he-utils';
import { isNull, isUndefined } from 'lodash';

const AudioVibration = types
  .model({
    id: types.identifier,
    name: types.string,
    start: types.number,
    audio: Audio,
    events: types.map(Event),
    repeat: Repeat,
    repeateditable: types.boolean,
    intensityRatio: types.map(types.number),
    frequencyRatio: types.map(types.number),
  })
  .views(self => ({

    get count() {
      return self.events.size;
    },
    get validEvents() {
      return valid(values(self.events));
    },
    get validEventCount() {
      return this.validEvents.length;
    },
    get sortedValidEvents() {
      return sorted(values(self.events));
    },
    get validEventsAbs() {
      return this.validEvents.map(e => {
        e.setRelativeTime(e.relativeTime + self.start);
        return e;
      });
    },
    get duration() {
      if (this.count === 0)
        return 100;
      let max = 0;
      self.events.forEach((value, key) => {
        if (value.relativeTime !== null) {
          const end = value.endWithRepeat;
          if (typeof (end) !== 'undefined') {
            max = end > max ? end : max;
          }
        }
      });
      return max;
    },
    get durationWithRepeat() {
      const d = this.duration;
      return d * self.repeat.times + self.repeat.interval * (self.repeat.times - 1);
    },
    get end() {
      return this.duration + self.start;
    },
    get endWithRepeat() {
      return this.durationWithRepeat + self.start;
    },
    get maxIntensity(): number {
      if (this.count === 0)
        return 100;
      let max = 0;
      self.events.forEach((value, key) => {
        if (value.relativeTime !== null) {
          max = value.intensity > max ? value.intensity : max;
        }
      })
      return max;
    },
    get maxFrequency(): number {
      if (this.count === 0)
        return 0;
      let max = 0;
      self.events.forEach((value, key) => {
        if (value.relativeTime !== null) {
          max = value.frequency > max ? value.frequency : max;
        }
      })
      return max;
    },
    get timeAtMin(): number {
      return timeAtMin(self.start);
    },
    get timeAtSec(): number {
      return timeAtSec(self.start);
    },
    get timeAtMSec(): number {
      return timeAtMSec(self.start!);
    },
    canAdd(t: number) {
      for (const [, v] of self.events) {
        if (!isNull(v.relativeTime) && !isUndefined(v.endWithRepeat) && (v.relativeTime + self.start) < t && v.endWithRepeat > t)
          return false;
      };
      return true;
    },
  }))
  .actions(self => ({
    setName(name: string) {
      self.name = name;
    },
    setStart(start: number) {
      self.start = start;
    },
    setRepeatEditable(b: boolean) {
      self.repeateditable = b;
    },
    setTotalIntensity(value: number) {
      const array = new Array<any>();
      array.push(...values(self.intensityRatio));
      const max = Math.max(...array);
      const ratio = value / max;
      self.events.forEach((event, key) => {
        if (self.intensityRatio.has(key)) {
          event.setIntensity(Math.round(ratio * self.intensityRatio.get(key)!));
        }
      });
    },
    setTotalFrequency(value: number) {
      const array = new Array<any>();
      array.push(...values(self.frequencyRatio));
      const max = Math.max(...array);
      const ratio = value / max;
      self.events.forEach((event, key) => {
        if (self.frequencyRatio.has(key)) {
          event.setFrequency(Math.round(ratio * self.frequencyRatio.get(key)!));
        }
      });
    },
    setAudio(name: string, src: string, target: string, data: Array<number>, rate: number, duration: number, samples: number) {
      self.audio = Audio.create({
        name: name,
        path: src,
        target: target,
        rate: rate,
        samples: samples,
        data: data,
        duration: duration,
      });
      // self.audio.data.replace(data);
    },
    addTransient(intensity: number = 100, frequency: number = 50, index: number = 0, time?: number) {
      const id = randomUuid();
      const event = Event.create({
        id: id,
        name: `Transient ${self.count}`,
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
          name: `Repeat for Transient ${self.count}`,
          times: 1,
          interval: 0,
        }),
        repeateditable: false,
      });
      self.events.set(id, event);
      self.intensityRatio.set(id, intensity);
      self.frequencyRatio.set(id, frequency);
      return id;
    },
    addContinuous(duration: number = 200, intensity: number = 100, frequency: number = 50, index: number = 0, time?: number, curve?: Array<ICurvePoint>) {
      const id = randomUuid();
      const event = Event.create({
        id: id,
        name: `Continuous ${self.count}`,
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
          name: `Repeat for Continuous ${self.count}`,
          times: 1,
          interval: 0,
        }),
        repeateditable: false,
      })
      if (!!curve && curve.length > 0) {
        curve.map((value: ICurvePoint) => {
          event.addCurvePoint(value.Time, value.Intensity, value.Frequency)
        })
      }
      else {
        event.addCurvePoint(0, 0, 0)
        event.addCurvePoint(1, 1, 0)
        event.addCurvePoint(duration - 1, 1, 0)
        event.addCurvePoint(duration, 0, 0)
      }
      self.events.set(id, event);
      self.intensityRatio.set(id, intensity);
      self.frequencyRatio.set(id, frequency);
      return id;
    },
    deleteEvent(id: string) {
      if (self.events.has(id)) {
        self.events.delete(id);
      }
      if (self.intensityRatio.has(id)) {
        self.intensityRatio.delete(id);
      }
      if (self.frequencyRatio.has(id)) {
        self.frequencyRatio.delete(id);
      }
    },
    updateIntensityRatio(id: string, value: number) {
      if (self.intensityRatio.has(id))
        self.intensityRatio.set(id, value);
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
    makesureLegal(t: number, space: number) {
      self.events.forEach(v => {
        if (v.relativeTime !== null && (v.relativeTime + self.start) >= t)
          v.relativeTime += space;
      });
    },
    resetRepeat() {
      self.repeateditable = false;
      self.repeat.interval = 0;
      self.repeat.times = 1;
    }
  }))

export default AudioVibration;
