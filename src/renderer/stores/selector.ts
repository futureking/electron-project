import { timeAtMin, timeAtMSec, timeAtSec } from '@/utils/utils';
import { types } from 'mobx-state-tree';

const Selector = types
  .model({
    start: types.number,
    end: types.number,
  })
  .views(self => ({
    get duration() {
      return self.end - self.start
    },
    get startAtMin() {
      return timeAtMin(self.start);
    },
    get startAtSec() {
      return timeAtSec(self.start);
    },
    get startAtMSec() {
      return timeAtMSec(self.start)
    },
    get endAtMin() {
      return timeAtMin(self.end);
    },
    get endAtSec() {
      return timeAtSec(self.end);
    },
    get endAtMSec() {
      return timeAtMSec(self.end)
    },
  }))
  .actions(self => ({
    setStart(start: number) {
      self.start = start;
    },
    setEnd(end: number) {
      self.end = end;
    },
    reset() {
      self.start = 0;
      self.end = 0;
    }
  }))

export { Selector };


