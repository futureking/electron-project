import { values } from 'mobx';
import {types} from 'mobx-state-tree';
import { Project, ProjectStore } from './project';
import { Selector } from './selector';
import { Selection } from './selection';

const RootStore = types
  .model({
    selector: Selector,
    selection: Selection,
    projectStore: ProjectStore,
  })
  // .actions(self => ({

  // }))

const store = RootStore.create({
  selector: {start: 0,end: 0},
  selection: {eid: '', type: '', gid: '', pid:''},
  projectStore: {},
})

export default store;
