import React from 'react';
import STYLES from './index.less';
interface IProps extends React.HTMLProps<HTMLDivElement> {
  title?: string;
}

const Repeat: React.FC<IProps> = (props) => {
  const { title = 'repeat', ...rest } = props;
  return(
    <div>
      <div className={STYLES.rect} {...rest}>
        <i><img src={require('../imgs/bg_repeat.svg')} /></i>
        <label>{'Repeat'}</label>
      </div>
    </div>
  )
}

export default Repeat;
