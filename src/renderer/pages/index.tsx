import React from 'react';
import { Link } from 'umi';
import { setProvider, useStore } from '../store';
import STYLES from './index.less';

const Index: React.FC = () => {
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
    </div>
  );
};

export default setProvider(Index);
