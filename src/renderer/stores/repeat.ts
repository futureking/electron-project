import { types } from 'mobx-state-tree';
const Repeat = types
  .model({
    name: types.string,
    times: types.number,
    interval: types.number,
  })
  .actions(self => ({
    setName(name: string) {
      self.name = name;
    },
    setRepeatTime(times: number) {
      self.times = times;
    },
    setInterval(interval: number) {
      self.interval = interval;
    },
  }))

export { Repeat };