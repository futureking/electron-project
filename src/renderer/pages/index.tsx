import React from 'react';
import Login from './login';
import STYLES from './index.less';

const Index: React.FC = () => {

  return (
    <div className={STYLES.wrap}>
      <Login />
    </div>
  );
};

export default Index;
