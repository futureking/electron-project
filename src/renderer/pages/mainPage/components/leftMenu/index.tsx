import React from 'react';
import CustomMenu from '../../../../components/menu';
import STYLES from './index.less';

const LeftMenu: React.FC = () => {
  return(
    <div className={STYLES.wrap}>
      <CustomMenu />
    </div>
  )
}

export default LeftMenu;