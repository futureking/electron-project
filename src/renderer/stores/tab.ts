import { types } from 'mobx-state-tree';

const Tab = types.model({
  id: types.identifier,
  name: types.string,
  type: types.enumeration(['Root', 'Group', 'A2V']),
  contentid: types.string,
  rootid: types.string,
  step: types.optional(types.number, 0),
  initduration: types.optional(types.number, 0),
  isSave: types.boolean
})
  .actions(self => ({
    goToGroup(contentid: string, subname: string, step: number, initduration: number) {
      self.type = 'Group';
      self.contentid = contentid;
      self.name = `${self.name}/${subname}`;
      self.step = step;
      self.initduration = initduration;
    },
    goToA2V(contentid: string, subname: string, step: number, initduration: number) {
      self.type = 'A2V';
      self.contentid = contentid;
      self.name = `${self.name}/${subname}`;
      self.step = step;
      self.initduration = initduration;
    },
    backRoot() {
      self.type = 'Root';
      self.contentid = self.rootid;
      self.name = self.name.split('/')[0];
      self.step = 0;
      self.initduration = 0;
    },
    setSave(flag: boolean = false) {
      self.isSave = flag;
    },
    updateRootName(rootname: string, type: string) {
      if (self.type === 'Root')
        self.name = `${rootname}(${type})`;
      else
        self.name = `${rootname}(${type})/${self.name.split('/')[1]}`;
    },
    updateSubName(subname: string) {
      if (self.type !== 'Root')
        self.name = `${self.name.split('/')[0]}/${subname}`;
    }
  }))

export default Tab;