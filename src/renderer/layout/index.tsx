import React from 'react';
import Header from '../components/header';
import STYLES from './index.less';

/**
 * @param param0 
 * @returns 
 */
const Layout: React.FC = ({children}) => {

  return(
    <div className={STYLES.wrap}>
      <div className={STYLES.header}>
        <Header />
      </div>
      <div className={STYLES.content}>
        {children}
      </div>
    </div>
  )
};

export default Layout;