import { types } from "mobx-state-tree";
const Audio = types
.model({
  name: types.string,
  path: types.string,
  target: types.string,
  data: types.array(types.number),
  rate: types.number,
  duration: types.number,
  samples:  types.number,
})
.views(self => ({
}))
.actions(self => ({
  setName(name: string) {
    self.name = name;
  },
  setPath(path: string) {
    self.path = path;
  },
  setTarget(path: string) {
    self.target = path;
  },
  setData(data: Array<number>) {
    self.data.replace(data);
  },
  setInfo(rate: number, duration: number, samples: number) {
      self.rate = rate;
      self.duration = duration;
      self.samples = samples;
  },
}))

export default Audio;