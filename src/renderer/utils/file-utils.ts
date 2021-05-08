import { applySnapshot } from 'mobx-state-tree';
import { OPEN_PROJ } from '@/../share/define/message';
import store from '@/stores';
const { ipcRenderer } = window;

const onOpenProject = () => {
  ipcRenderer.invoke(OPEN_PROJ).then(r => {
    if (typeof r === 'undefined')
      return;
    let url = r.url;
    console.info(url);
    debugger
    let project = JSON.parse(r.data);
    try {
      store.projectStore.addEmptyProject(project!.id);
      applySnapshot(store.projectStore.projects.get(project!.id)!, project);
      store.projectStore.projects.get(project!.id)!.setName(r.name);
      store.projectStore.projects.get(project!.id)!.setUrl(url);
      store.selection.setSelection('Project', project!.id);
    } catch (error) {
      console.error(error);
    }
  });
}

export { onOpenProject }

