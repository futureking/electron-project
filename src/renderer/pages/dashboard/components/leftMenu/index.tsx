import React from 'react';
import { history } from 'umi';
import { openProject } from '@/utils/file-utils';
import STYLES from './index.less';
import { PAGE_CHG_MAIN } from '@/../share/define/message';
import { createProject } from '@/cmd';
const { ipcRenderer } = window;

const LeftMenu: React.FC = () => {

  const onCreate = () => {
    createProject();
    ipcRenderer.invoke(PAGE_CHG_MAIN).then(() => history.push('/main'));
  }

  const onOpen = () => {
    openProject();
    // ipcRenderer.invoke(PAGE_CHG_MAIN).then(() => {
    //   history.push('/main');
    // });
  }

  return (
    <div className={STYLES.wrap}>
      <div className={STYLES.logo} onClick={() => history.push('./')}>
        <img src={require('../../imgs/logo.svg')} alt="" />
      </div>
      <ul className={STYLES.list}>
        <li onClick={onCreate} style={{background:'#323842'}}>
          <img src={require('./img/create.png')} alt="" />
          Create New
        </li>
        <li onClick={onOpen}>
          <img src={require('./img/open.png')} alt="" />
          Open
        </li>
      </ul>
      <div className={STYLES.footer}>
        <p>
          <img src={require('../../imgs/account.svg')} />
          <span>Account</span>
        </p>
        <p>
          <img src={require('../../imgs/help.svg')} />
          <span>Help</span>
        </p>
      </div>
    </div>
  )
}

export default LeftMenu;