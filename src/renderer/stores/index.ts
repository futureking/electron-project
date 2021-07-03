import { types } from 'mobx-state-tree';
import { Selector } from './selector';
import { Selection } from './selection';
import Tab from './tab';
import { randomUuid } from '@/utils/utils';
import Project from './project';
import { UndoManager } from 'mst-middlewares';
import { isNull, isUndefined } from 'lodash';
// import { UndoManager } from 'mst-middlewares'

const RootStore = types
  .model({
    selector: Selector,
    selection: Selection,
    projects: types.map(Project),
    tabs: types.array(Tab),
  })
  .views(self => ({
    get countProject() {
      return self.projects.size;
    },
    get currentTab() {
      return self.tabs.find(e => e.id === self.selection.tabid);
    },
    get current() {
      const tab = this.currentTab;
      if (!!tab) {
        return self.projects.get(tab.rootid);
      }
      return;
    },
    get currentGroup() {
      const tab = this.currentTab;
      if (!!tab && tab.type === 'Group' && self.projects.has(tab.rootid)) {
        return self.projects.get(tab.rootid)!.groups.get(tab.contentid);
      }
      return;
    },
    get currentA2V() {
      const tab = this.currentTab;
      if (!!tab && tab.type === 'A2V' && self.projects.has(tab.rootid)) {
        return self.projects.get(tab.rootid)!.a2vs.get(tab.contentid);
      }
      return;
    },
    get focusEvent() {
      const tab = this.currentTab;
      const current = this.current;
      if (!!tab && !!current) {
        if (self.selection.focusType === 'Event' || self.selection.focusType === 'Event-Repeat') {
          switch (tab.type) {
            case 'Root':
              return current.events.get(self.selection.focusid);
            case 'Group':
              return current.groups.get(tab.contentid)!.events.get(self.selection.focusid);
            case 'A2V':
              return current.a2vs.get(tab.contentid)!.events.get(self.selection.focusid);
          }
        }
      }
      return;
    },
    get focusGroup() {
      const tab = this.currentTab;
      const current = this.current;
      if (!!tab && !!current) {
        if (self.selection.focusType === 'Group' || self.selection.focusType === 'Group-Repeat') {
          switch (tab.type) {
            case 'Root':
              return current.groups.get(self.selection.focusid);
            case 'Group':
              return current.groups.get(tab.contentid);
          }
        }
      }
      return;
    },
    get focusA2V() {
      const tab = this.currentTab;
      const current = this.current;
      if (!!tab && !!current) {
        if (self.selection.focusType === 'A2V' || self.selection.focusType === 'A2V-Repeat') {
          switch (tab.type) {
            case 'Root':
              return current.a2vs.get(self.selection.focusid);
            case 'A2V':
              return current.a2vs.get(tab.contentid);
          }
        }
      }
      return;
    },
    get lastTab() {
      if (self.tabs.length > 0)
        return self.tabs[self.tabs.length - 1];
      return;
    },
    get hasAudio() {
      const tab = this.currentTab;
      if (tab) {
        switch (tab.type) {
          case 'A2V':
            return true;
          case 'Group':
            const group = this.currentGroup;
            return (group && group.audio) ? true : false;
          case 'Root':
            return (this.current && this.current.background) ? true : false;
        }
      }
      return false;
    },
    get audio() {
      const tab = this.currentTab;
      if (tab) {
        switch (tab.type) {
          case 'A2V':
            const a2v = store.currentA2V;
            if (!isUndefined(a2v)) {
              return a2v.audio;
            }
            break;
          case 'Group':
            const group = store.currentGroup;;
            if (!isUndefined(group) && !isNull(group.audio)) {
              return group.audio;
            }
            break;
          case 'Root':
            const project = this.current;
            if (project && project.background)
              return project.background;
            break;
        }
      }
      return;
    },
    get audioPath() {
      const audio = this.audio;
      if (!isUndefined(audio)) {
        return audio.target;
      }
      return;
    }

  }))
  .actions(self => ({
    addTab(rootid: string, name: string) {
      const id = randomUuid();
      const tab = Tab.create({
        id: id, name: name, type: 'Root', contentid: rootid, rootid: rootid, isSave: false,
      });
      self.tabs.push(tab);
      return id;
    },
    deleteTab(id: string) {
      const i = self.tabs.findIndex(e => e.id === id);
      self.tabs.splice(i, 1);
    },
    hasTab(id: string) {
      const found = self.tabs.find(e => e.contentid === id)
      return isUndefined(found) ? false : true;
    },
    getRootTab(id: string, name: string) {
      const found = self.tabs.find(tab => tab.contentid === id);
      if (isUndefined(found)) {
        return this.addTab(id, name);
      }
      return found.id;
    }
  }))
  .actions(self => {
    // setUndoManager(self);
    return {
      addProject(name: string, type: 'Basic' | 'Stereo', pid?: string | null) {
        const id = pid ? pid : randomUuid();
        if (name === '')
          name = `Project ${self.countProject + 1}`;

        const project = Project.create({ id: id, name: name, type: type, url: '', background: null });
        self.projects.set(id, project);
        return project;
      },
      addEmptyProject(id: string) {
        const project = Project.create({ id: id, name: '', type: 'Basic', url: '', background: null });
        self.projects.set(id, project);
        return id;
      },
      delProject(id: string) {
        if (self.projects.has(id)) {
          self.projects.delete(id)
        }
      },
      recoverPeoject(obj: any, name: string, url: string) {
        const project = Project.create({ ...obj, name: name, url: url });
        self.projects.set(project.id, project);
      }
    }

  })

// export let undoManager = {} as any;
// export const setUndoManager = (targetStore:any) => {
//   undoManager = UndoManager.create({}, {targetStore})
// }
const store = RootStore.create({
  selector: { start: 0, end: 0 },
  selection: { tabid: '', focusType: '', focusid: '', indType: 'Pointer', x: 0, y: 0, isSave: false, isEditCurve: false, pasteObj:null },
  projects: {},
  tabs: [],
})

export let undoManager = new Map<any, any>();
export const setUndoManager = (targetStore: any) => {
  undoManager.set(targetStore.id, UndoManager.create({}, { targetStore }));
}

export default store;
