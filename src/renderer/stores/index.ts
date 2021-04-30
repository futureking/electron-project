import { types } from 'mobx-state-tree';
import { ProjectStore } from './project';
import { Selector } from './selector';
import { Selection } from './selection';

const RootStore = types
  .model({
    selector: Selector,
    selection: Selection,
    projectStore: ProjectStore,
  })
  .views(self => ({
    get current() {
      return self.projectStore.projects.get(self.selection.pid);
    }
  }))
// .actions(self => ({

// }))

const store = RootStore.create({
  selector: { start: 0, end: 0 },
  selection: { eid: '', type: '', gid: '', pid: '' },
  projectStore: {},
})

export default store;
