
import { transientDuration } from '@/utils/he-utils';
import { timeAtMin, timeAtMSec, timeAtSec } from '@/utils/utils';
import { types } from 'mobx-state-tree';
import { Repeat } from './repeat';

function sorted(events: any) {
  return events
    .filter((b) => b.relativeTime !== null)
    .sort((a: any, b: any) => (a.relativeTime > b.relativeTime ? 1 : a.relativeTime === b.relativeTime ? 0 : -1))
}

function valid(events: any) {
  return events.filter(b => b.relativeTime !== null);
}

const CurvePoint = types
  .model({
    time: types.number,
    intensity: types.number,
    frequency: types.number,
  })
  .actions(self => ({
    setTime(time: number) {
      self.time = time;
    },
    setIntensity(intensity: number) {
      self.intensity = intensity;
    },
    setFrequency(frequency: number) {
      self.frequency = frequency;
    },
  }))

const Event = types
  .model({
    id: types.identifier,
    name: types.string,
    type: types.enumeration("Type", ["Transient", "Continuous"]),
    index: types.number,
    relativeTime: types.maybeNull(types.number),
    duration: types.number,
    intensity: types.number,
    frequency: types.number,
    curve: types.array(CurvePoint),
    curveeditable: types.boolean,
    curveRatio: types.array(types.number),
    repeat: Repeat,
    repeateditable: types.boolean,
  })
  .views(self => ({
    get ponitCount(): number {
      return self.curve!.length
    },
    get durationWithRepeat(): number {
      return self.duration + (self.duration + self.repeat.interval) * (self.repeat.times-1);
    },
    get end() {
      if (self.relativeTime !== null) {
        return self.relativeTime + self.duration;
      }
      return;
    },
    get endWithRepeat() {
      if (self.relativeTime !== null) {
        return self.relativeTime + self.duration * self.repeat.times + self.repeat.interval * (self.repeat.times-1);
      }
      return;
    },
    get maxIntensity(): number {
      let arr = self.curve!.map(p => p.intensity);
      return Math.floor(self.intensity * Math.max(...arr))
    },
    get relativeTimeAtMin(): number {
      return self.relativeTime === null ? 0 : timeAtMin(self.relativeTime);
    },
    get relativeTimeAtSec(): number {
      return self.relativeTime === null ? 0 : timeAtSec(self.relativeTime);
    },
    get relativeTimeAtMSec(): number {
      return self.relativeTime === null ? 0 : timeAtMSec(self.relativeTime!);
    },
    get isTransient(): boolean {
      return self.type === 'Transient' ? true : false;
    }
  }))
  .actions(self => ({
    setName(name: string) {
      self.name = name;
    },
    setRelativeTime(relativeTime: number | null) {
      self.relativeTime = relativeTime;
    },
    setDuration(duration: number) {
      self.duration = duration;
      if (self.type === 'Continuous') {
        if (self.curveeditable) {
          self.curve.map((p, i) => {
            const nT = Math.round(self.curveRatio[i] * duration);
            p.setTime(nT);
          });
          self.curve[self.curve.length - 1].time = duration;
        }
        else {
          self.curve[0].time = 0;
          self.curve[1].time = 1;
          self.curve[self.curve.length - 2].time = duration - 1;
          self.curve[self.curve.length - 1].time = duration;
        }
      }
    },
    setIntensity(intensity: number) {
      self.intensity = intensity;
    },
    setFrequency(frequency: number) {
      self.frequency = frequency;
      if (self.type === 'Transient') {
        self.duration = transientDuration(frequency);
      }
    },
    setRepeatEditable(b: boolean) {
      self.repeateditable = b;
    },
    // addCurve(point: ICurvePoint) {
    //   self.curve.push({ time: point.Time, intensity: point.Intensity, frequency: point.Frequency })
    // },
    addCurvePoint(time: number, intensity: number = 100, frequency: number = 50) {
      self.curve.push({ time: time, intensity: intensity, frequency: frequency })
      self.curveRatio.push(time / self.duration);
    },
    editCurve(data) {
      self.curve.clear();
      data.map(item => {
        self.curve.push(item);
      })
    },
    setCurveRatio(data) {
      self.curveRatio.clear();
      self.curveRatio = data;
    },  
    setCurveEditable(b: boolean) {
      self.curveeditable = b;
    },
    resetRepeat() {
      self.repeateditable = false;
      self.repeat.interval = 0;
      self.repeat.times = 1;
    }
  }))

export { Event, valid, sorted };

