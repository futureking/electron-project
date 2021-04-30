import React, { useState, useEffect, useMemo } from 'react';
import { Addon, Graph } from '@antv/x6';
import { PlusOutlined } from '@ant-design/icons';
import { Collapse } from 'antd';
import STYLES from './index.less';

const { Dnd } = Addon;
const { Panel } = Collapse;

interface IGroupItem {
  key: string;
  name: string;
  cellTypes: string[];
}

interface Iprops {
  flowChart: Graph
}

interface IPanelContentProps {
  dnd: Addon.Dnd;
  cellTypes: string[];
}

const GENERAL_GROUP = [
  {
    key: 'basic',
    name: 'Basic UI',
    cellTypes: ['imove-start', 'imove-branch', 'imove-behavior']
  },
  {
    key: 'game',
    name: 'Game Effect',
    cellTypes: ['imove-start', 'imove-branch', 'imove-behavior']
  },
  {
    key: 'ads',
    name: 'Ads Effect',
    cellTypes: ['imove-start', 'imove-branch', 'imove-behavior']
  },
  {
    key: 'musical',
    name: 'Musical instrument',
    cellTypes: ['imove-start', 'imove-branch', 'imove-behavior']
  }
];

const Title = ({title, hasRight=false}) => {
  return(
    <div className={STYLES.title}>
      <label>{title}</label>
      { hasRight && <i><PlusOutlined /></i> }
    </div>
  )
}

const Search = () => {
  return(
    <div className={STYLES.search}>
      <i>
        <img src={require('./imgs/search.svg')} />
      </i>
      <input placeholder="Search on Assets"  />
    </div>
  )
};

const PanelContent: React.FC<IPanelContentProps> = (props) => {
  const {  cellTypes } = props;
  // const onMouseDown = (evt: any, cellType: string) => {
  //   dnd.start(Node.create({ shape: cellType }), evt);
  // };
  return (
    <div className={STYLES.panelContent}>
      {cellTypes.map((cellType, index) => {
        // const Component = cellMap[cellType];
        // return (
        //   <div key={index} className={STYLES.cellWrapper}>
        //     <Component onMouseDown={(evt: any) => onMouseDown(evt, cellType)} />
        //   </div>
        // );
      })}
    </div>
  );
};

const Assets: React.FC<Iprops> = (props) => {
  const { flowChart } = props;
  const dnd = useMemo(() => new Dnd({ target: flowChart, scaled: true }), [
    flowChart,
  ]);

  const [groups, setGroups] = useState<IGroupItem[]>([]);

  useEffect(() => {
    setGroups(GENERAL_GROUP);
  }, [])

  return(
    <div className={STYLES.wrap}>
      <div className={STYLES.content}>
        <Title title='Drop the items into the builder' hasRight />
        <Search />
      </div>
      <div className={STYLES.content}>
        <Title title='Basic' />
        <div className={STYLES.graph} id="AssetsBasic">
          
        </div>
        
        <Title title='Pattern Library' />
        <div className={STYLES.graph} id="AssetsBasic">
          <Collapse
            className={STYLES.collapse}
            defaultActiveKey={['general', 'custom']}
          >
            {groups.map((group) => (
              <Panel key={group.key} header={group.name}>
                <PanelContent dnd={dnd} cellTypes={group.cellTypes} />
              </Panel>
            ))}
          </Collapse>
        </div>
      </div>
    </div>
  )
}

export default Assets;