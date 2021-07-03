import { OPEN_PROJ, PAGE_CHG_MAIN } from '@/../share/define/message';
import store from '@/stores';
import { isUndefined } from 'lodash';
import { message } from 'antd';
const { ipcRenderer } = window;
import { history } from 'umi';

function openProject(filePath: string = '') {  
  ipcRenderer.invoke(OPEN_PROJ, filePath).then(r => {
    if (isUndefined(r)) return;
    let project = JSON.parse(r.data);
    if (isUndefined(project))
      return;
    try {
      const projectid = project.id;
      const name = `${project.name}(${project.type})}`;
      if (history.location.pathname === '/dashboard') {
        ipcRenderer.invoke(PAGE_CHG_MAIN).then(() => {
          history.push('/main');
        });
      }
      store.recoverPeoject(project, r.name, r.url);
      const tabid = store.getRootTab(projectid, name);
      store.selection.changeTab(tabid);
      store.selection.selectRoot();
      store.selector.reset();
    } catch (e) {
      console.error('openProject error', e);
    }
  })
  .catch(reject => {console.error(reject.message);
    message.info(`Cann't open project ${filePath} `);
    return;
  });
}


export { openProject }

