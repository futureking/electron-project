import React from 'react';
// import CreateIcon from './img/create.png';
// import OpenIcon from './img/open.png';
import STYLES from './index.less';

const LeftMenu: React.FC = () => {
  return(
    <div className={STYLES.wrap}>
      <div className={STYLES.logo}>
        <h1>logo</h1>
      </div>
      <ul className={STYLES.list}>
        <li>
          {/* <img src={CreateIcon} /> */}
          Create New
        </li>
        <li>
          {/* <img src={OpenIcon} /> */}
          Open
        </li>
      </ul>
      <div className={STYLES.footer}>
        <p>Account</p>
        <p>Help</p>
      </div>
    </div>
  )
}

export default LeftMenu;