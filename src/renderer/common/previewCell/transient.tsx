import React from 'react';

import STYLES from './index.less';

interface IProps extends React.HTMLProps<HTMLDivElement> {
  title?: string;
}

const Cell: React.FC<IProps> = (props) => {
  const { title = 'transient', ...rest } = props;
  
  return(
    <div>
      <div className={STYLES.rect} {...rest}>
        <i><img src={require('../imgs/bg_transient.svg')} /></i>
        <label>{'Transient'}</label>
      </div>
    </div>
  )
}

export default Cell;
