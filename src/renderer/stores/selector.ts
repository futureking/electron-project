import {types} from 'mobx-state-tree';

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
    return Math.floor(self.start / 60000)
  },
  get startAtSec() {
    return Math.floor((self.start % 60000) / 1000 )
  },
  get startAtMSec() {
    return (self.start % 1000)
  },
  get endAtMin() {
    return Math.floor(self.end / 60000)
  },
  get endAtSec() {
    return Math.floor((self.end % 60000) / 1000 )
  },
  get endAtMSec() {
    return (self.end % 1000)
  },
}))
.actions(self => ({
  setStart(start: number) {
    self.start= start;
  },
  setEnd(end: number) {
    self.end= end;
  }
}))

export {Selector};


