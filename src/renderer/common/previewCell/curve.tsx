import React from 'react';

import STYLES from './index.less';

interface IProps extends React.HTMLProps<HTMLDivElement> {
  title?: string;
}

const Curve: React.FC<IProps> = (props) => {
  const { title = 'curve', ...rest } = props;
  
  return(
    <div>
      <div className={STYLES.rect} {...rest}>
        <i><img src={require('../imgs/bg_curve.svg')} /></i>
        <label>{'Curve'}</label>
      </div>
    </div>
  )
}

export default Curve;
