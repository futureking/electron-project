import React, { useState } from 'react';
import classnames from 'classnames';
import Assets from '../Assets';
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

const StreamGraph: React.FC =() => {

  const [key, setKey] = useState(1);
  console.info('StreamGraph')

    return(
      <div className={STYLES.wrap}>
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
          { key===1 ? <Assets /> : <Assets /> }
        </div>
      </div>
    )
  
}

export default StreamGraph;