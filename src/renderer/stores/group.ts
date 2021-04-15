import { randomUuid, timeAtMin, timeAtMSec, timeAtSec } from '@/utils/utils';
import { values } from 'mobx';
import {getParent, getParentOfType, types} from 'mobx-state-tree';
import { Event } from './events';
const Group = types
.model({
  id: types.identifier,
  name: types.string,
  start: types.number,
  events: types.array(types.reference(Event))
})
.views(self => ({
  get count() {
    return self.events.length;
  },
  get validEvents() {
    return self.events.filter(event => event.relativeTime!==null)
  },

  get duration(): number {
    if (this.count === 0)
      return 0
    const vailds = this.validEvents
    if (vailds.length > 0)
      return vailds[vailds.length - 1].eventDuration + vailds[vailds.length - 1].relativeTime! - self.start
    else
      return 0
  },
  get maxIntensity(): number {
    if (this.count === 0)
      return 0
    let max = 0
    const vailds = this.validEvents
    if (vailds.length > 0)
      vailds.map(v => max = Math.max(v.intensity, max))
    console.log('max intensity:',max)
    return max
  },
  get maxFrequency(): number {
    if (this.count === 0)
      return 0
    let max = 0
    const vailds = this.validEvents
    if (vailds.length > 0)
      vailds.map(v => max = Math.max(v.frequency, max))
    console.log('max frequency:',max)
    return max
  },
  get timeAtMin() : number {
    return timeAtMin(self.start);
  },
  get timeAtSec() : number {
    return timeAtSec(self.start);
  },
  get timeAtMSec() : number {
    return timeAtMSec(self.start!);
  },
}))
.actions(self => ({
  setName(name: string) {
    self.name = name;
  },
  setStart(start: number) {
    self.start = start;
  },
}))

export {Group};
