import React from 'react';
import { history } from 'umi';
import { onOpenProject } from '@/utils/file-utils';
import STYLES from './index.less';

const LeftMenu: React.FC = () => {

  const onCreate = () => {
    history.push('./main');
  }

  const onOpen = () => {
    onOpenProject();
  }

  return(
    <div className={STYLES.wrap}>
      <div className={STYLES.logo}>
        <img src={require('../../imgs/logo.svg')} alt="" />
      </div>
      <ul className={STYLES.list}>
        <li onClick={onCreate}>
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