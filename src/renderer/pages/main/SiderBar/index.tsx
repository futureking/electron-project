import React, { useState } from 'react';
import classnames from 'classnames';
import 'antd/es/collapse/style';
import { Graph } from '@antv/x6';
import Assets from './components/Assets';
import Function from './components/Functions';
import STYLES from './index.less';

const TabData = [
  {
    id: 1,
    name: 'Assets'
  },
  {
    id: 2,
    name: 'Function'
  }
];

interface ISideBarProps {
  flowChart: Graph;
}


const SideBar: React.FC<ISideBarProps> = (props) => {
  const { flowChart } = props;
  const [key, setKey] = useState(1);

  return (
    <div className={STYLES.container}>
      <div className={STYLES.tabs}>
          {
            TabData.map(tab => {
             return <label 
                key={tab.id}
                className={classnames({
                  [STYLES.active]: tab.id === key
                })}
                onClick={() => {
                  setKey(tab.id)
                }}
              >
                {tab.id === key && <i></i>}
                {tab.name}
              </label>
            })
          }
        </div>
        <div className={STYLES.content}>
          { key===1 ? <Assets flowChart={flowChart} /> : <Function flowChart={flowChart} /> }
        </div>
      
    </div>
  );
};

export default SideBar;
