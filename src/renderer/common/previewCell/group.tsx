import React from 'react';
import store from '@/stores';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import STYLES from './index.less';

interface IProps extends React.HTMLProps<HTMLDivElement> {
  title?: string;
}

const Cell: React.FC<IProps> = observer((props) => {
  const { title = 'group', ...rest } = props;
  return(
    <div className={classnames({
      [STYLES.disabled]: store.currentTab!.type !== 'Root'
    })}>
      <div className={STYLES.rect} {...rest}>
        <i><img src={require('../imgs/bg_group.svg')} /></i>
        <label>{'Group'}</label>
      </div>
    </div>
  )
})

export default Cell;
