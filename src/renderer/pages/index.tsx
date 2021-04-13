import React from 'react';
import { Link } from 'umi';
import { setProvider } from '../store';
import STYLES from './index.less';

const { remote } = window.require('electron');

const Index: React.FC = () => {

  const onOpenDialog = () => {
    remote.dialog.showOpenDialog({
      properties: ['openDirectory'],
      message: '选择文件的存储路径',
    }, (path) => {
      if (Array.isArray(path)) {

      }
    })
  }

  return (
    <div className={STYLES.wrap}>
      <Link to='/dashboard'>
        <h2>dashboard</h2>
      </Link>
      <br />
      <Link to="/login">
       <h3>login</h3>
      </Link>
      <Link to="/mainpage">
        <h4>mainpage</h4>
      </Link>
      <h3 onClick={onOpenDialog}>test</h3>
    </div>
  );
};

export default setProvider(Index);
