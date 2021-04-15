
import { timeAtMin, timeAtMSec, timeAtSec } from '@/utils/utils';
import {types} from 'mobx-state-tree';

const CurvePoint = types
  .model({
    time: types.number,
    intensity: types.number,
    frequency: types.number,
  })
  .actions(self => ({
    setTime(time: number) {
      self.time= time;
    },
    setIntensity(intensity: number) {
      self.intensity= intensity;
    },
    setFrequency(frequency: number) {
      self.frequency= frequency;
    },
  }))

const Event = types
  .model({
    id: types.identifier,
    name: types.string,
    type: types.enumeration("Type", ["Transient", "Continuous"]),
    relativeTime: types.maybeNull(types.number),
    duration: types.maybeNull(types.number),
    intensity: types.number,
    frequency: types.number,
    curve: types.maybeNull(types.array(CurvePoint)),
  })
  .views(self => ({
    get ponitCount(): number {
      return self.curve!.length
    },
    get eventDuration(): number {
      if (self.type === "Continuous" && !!self.duration)
        return self.duration
      else {
        if (self.frequency >= 0 && self.frequency <= 4)
          return 41;
        else if (self.frequency >= 5 && self.frequency <= 13)
            return 28;
        else if (self.frequency >= 14 && self.frequency <= 22)
            return 25;
        else if (self.frequency >= 23 && self.frequency <= 33)
            return 25;
        else if (self.frequency >= 34 && self.frequency <= 40)
            return 20;
        else if (self.frequency >= 41 && self.frequency <= 49)
            return 18;
        else if (self.frequency >= 50 && self.frequency <= 59)
            return 16;
        else if (self.frequency >= 60 && self.frequency <= 68)
            return 15;
        else if (self.frequency >= 69 && self.frequency <= 77)
            return 12;
        else if (self.frequency >= 78 && self.frequency <= 86)
            return 12;
        else if (self.frequency >= 87 && self.frequency <= 100)
            return 10;
        else
          return 0;
      }
    },
    get maxIntensity(): number {
      let arr = self.curve!.map(p=>p.intensity);
      return Math.floor(self.intensity * Math.max(...arr))
    },
    get relativeTimeAtMin() : number {
      return self.relativeTime===null?0:timeAtMin(self.relativeTime);
    },
    get relativeTimeAtSec() : number {
      return self.relativeTime===null?0:timeAtSec(self.relativeTime);
    },
    get relativeTimeAtMSec() : number {
      return self.relativeTime===null?0:timeAtMSec(self.relativeTime!);
    },
  }))
  .actions(self => ({
    setName(name: string) {
      self.name = name;
    },
    // setType(type: "Transient"|"Continuous") {
    //   self.type= type;
    // },
    setRelativeTime(relativeTime: number|null) {
      self.relativeTime = relativeTime;
    },
    setDuration(duration: number) {
      if (self.duration !== null)
        self.duration = duration;
    },
    setIntensity(intensity: number) {
      self.intensity = intensity;
    },
    setFrequency(frequency: number) {
      self.frequency = frequency;
    },
    // addCurve(point: ICurvePoint) {
    //   self.curve.push({ time: point.Time, intensity: point.Intensity, frequency: point.Frequency })
    // },
    addCurvePoint(time: number, intensity: number = 100, frequency: number = 50) {
      self.curve!.push({time: time, intensity: intensity, frequency: frequency })
    },
  }))

export {Event};

