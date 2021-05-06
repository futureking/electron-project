import React, { useState, useEffect, useMemo } from 'react';
import classnames from 'classnames';
import 'antd/es/collapse/style';
import STYLES from './index.less';

// import { Collapse } from 'antd';
import { Addon, Node, Graph } from '@antv/x6';
import Assets from './components/Assets';
import cellMap from '@/common/previewCell';

const { Dnd } = Addon;
// const { Panel } = Collapse;
const GENERAL_GROUP = {
  key: 'general',
  name: '通用元件',
  cellTypes: ['node-transient', 'node-continues', 'imove-behavior'],
};

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

interface IGroupItem {
  key: string;
  name: string;
  cellTypes: string[];
}

interface ISideBarProps {
  flowChart: Graph;
}

interface IPanelContentProps {
  dnd: Addon.Dnd;
  cellTypes: string[];
}


const SideBar: React.FC<ISideBarProps> = (props) => {
  const { flowChart } = props;
  const [key, setKey] = useState(1);
  const [groups, setGroups] = useState<IGroupItem[]>([]);
  const dnd = useMemo(() => new Dnd({ 
    target: flowChart, 
    scaled: true 
  }), [flowChart]);
  console.info(groups, dnd);

  // life
  useEffect(() => {
    // TODO: fetch to get custom group data
    setGroups([GENERAL_GROUP]);
  }, []);

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
          { key===1 ? <Assets flowChart={flowChart} /> : <Function /> }
        </div>
      
    </div>
  );
};

// const Assets = ({groups, dnd}) => {
//   return(
//     <div>
//       <Collapse
//         className={STYLES.collapse}
//         defaultActiveKey={['general', 'custom']}
//       >
//         {groups.map((group) => (
//           <Panel key={group.key} header={group.name}>
//             <PanelContent dnd={dnd} cellTypes={group.cellTypes} />
//           </Panel>
//         ))}
//       </Collapse>
//     </div>
//   )
// }

const Function = () => {
  return(
    <div>
      function
    </div>
  )
}

const PanelContent: React.FC<IPanelContentProps> = (props) => {
  const { dnd, cellTypes } = props;
  const onMouseDown = (evt: any, cellType: string) => {
    dnd.start(Node.create({ shape: cellType }), evt);
  };
  return (
    <div className={STYLES.panelContent}>
      {cellTypes.map((cellType, index) => {
        const Component = cellMap[cellType];
        return (
          <div key={index} className={STYLES.cellWrapper}>
            <Component onMouseDown={(evt: any) => onMouseDown(evt, cellType)} />
          </div>
        );
      })}
    </div>
  );
};

export default SideBar;
