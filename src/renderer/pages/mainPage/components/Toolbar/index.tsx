
import React from 'react';
import STYLES from './index.less';

const ToolBar: React.FC = (props: any) => {

  return(
    <div className={STYLES.wrap}>
      <ul className={STYLES.left}>
        <li><img src={require('./imgs/export.svg')} /></li>
        <li><img src={require('./imgs/arrow.svg')} /></li>
        <li><img src={require('./imgs/refresh.svg')} /></li>
        <li><img src={require('./imgs/hand.svg')} /></li>
        <li><img src={require('./imgs/filter.svg')} /></li>
      </ul>
      <ul className={STYLES.right}>
        <li><img src={require('./imgs/play.svg')} /></li>
        <li><img src={require('./imgs/save.svg')} /></li>
      </ul>
    </div>
  )
}

export default ToolBar