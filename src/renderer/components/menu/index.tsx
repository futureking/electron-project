import React, { useState, useEffect } from 'react';
import STYLES from './index.less';


const CustomMenu: React.FC = () => {  
  const [current, setCurrent] = useState('1');

  const handleClick = (e) => {
    setCurrent(e.key);
  }

  return (
    <ul className={STYLES.wrap}>
      <li></li>
    </ul>
  )
}

export default CustomMenu;