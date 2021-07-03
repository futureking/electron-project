import React from 'react';

import STYLES from './index.less';

interface IProps extends React.HTMLProps<HTMLDivElement> {
  title?: string;
}

const Cell: React.FC<IProps> = (props) => {
  const { title = 'S to V', ...rest } = props;
  
  return(
    <div>
      <div className={STYLES.rect} {...rest}>
        <i><img src={require('../imgs/bg_AtoV.svg')} /></i>
        <label>{'S to V'}</label>
      </div>
    </div>
  )
}

export default Cell;
