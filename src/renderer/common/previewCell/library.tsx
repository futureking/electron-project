import { GET_LIB_INFO } from '@/../share/define/message';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';

import STYLES from './index.less';

const { ipcRenderer } = window;

interface IProps extends React.HTMLProps<HTMLDivElement> {
  title?: string;
}

const Cell: React.FC<IProps> = observer((props) => {
  const { title, ...rest } = props;
  const [backgroundPic, setBackgroundPic] = useState('');
  useEffect(() => {
    async function getLibInfo() {
      const lib = await ipcRenderer.invoke(GET_LIB_INFO, title);
      const str = lib.bg.replaceAll('\\', '/') ;
      setBackgroundPic(str);
    }
    getLibInfo();
  }, []);
  return (
    <div>
      <div className={STYLES.rect} {...rest}
        style={backgroundPic !== ""? { background: `url(${require('../../../../library/' + backgroundPic)})` } : {} }
      >
        <label>{title}</label>
      </div>
    </div>
  )
});

export default Cell;