import React, { useState, useEffect, useMemo } from 'react';
import { Addon, Node, Graph } from '@antv/x6';
import { PlusOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';
import { isNull, isUndefined } from 'lodash';
import store from '@/stores';
import cellMap from '@/common/previewCell';
import { Collapse } from 'antd';
import STYLES from './index.less';

import { LIST_LIB_ON_TYPE, LIST_LIB_TYPE } from '@/../share/define/message';
const { ipcRenderer } = window;

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

const BASIC_GROUP = [
  {
    key: 'basic',
    name: 'Basic UI',
    cellTypes: ['node-transient', 'node-continues', 'node-group', 'node-AtoV', 'node-background']
  }
];

const Title = ({ title, hasRight = false }) => {
  return (
    <div className={STYLES.title}>
      <label>{title}</label>
      {hasRight && <i><PlusOutlined /></i>}
    </div>
  )
}

const Search = () => {
  return (
    <div className={STYLES.search}>
      <i>
        <img src={require('../../imgs/search.svg')} />
      </i>
      <input placeholder="Search on Assets" />
    </div>
  )
};

const PanelContent: React.FC<IPanelContentProps> = observer((props) => {
  const { dnd, cellTypes } = props;
  let newCellTypes: string[] = new Array();
  const tab = store.currentTab;
  if (!isUndefined(tab)) {
    switch (tab.type) {
      case 'Root':
        newCellTypes = cellTypes;
        break;
      case 'Group':
        newCellTypes = cellTypes.filter(item => item !== 'node-group' && item !== 'node-AtoV' && item !== 'node-background')
        break;
      case 'A2V':
        newCellTypes = cellTypes.filter(item => item !== 'node-group' && item !== 'node-AtoV' && item !== 'node-background')
        break;
      default:
        newCellTypes = cellTypes;
        break;

    }
  }
  const onMouseDown = (evt: any, cellType: string) => {
    dnd.start(Node.create({ shape: cellType }), evt);
  };

  return (
    <div className={STYLES.panelContent}>
      {
        newCellTypes.map((cellType, index) => {
          const Component = cellMap[cellType];
          return (
            <div key={index} className={STYLES.cellWrapper}>
              <Component title={cellType} onMouseDown={(evt: any) => onMouseDown(evt, cellType)} />
            </div>
          );
        })}
    </div>
  );
});

interface orginType {
  node: any,
  x: null | number,
  y: null | number
}


const Assets: React.FC<Iprops> = observer((props) => {
  const data = {
    node: {}, x: null, y: null
  }
  let orginNode: orginType = data;
  const { flowChart } = props;
  flowChart.on(
    'node:mouseenter', ({ e, node }) => {
      const sourceNode = node.getProp();
      orginNode = {
        node: node,
        x: sourceNode.position!.x,
        y: sourceNode.position!.y
      };
    }
  );
  flowChart.on('node:mouseleave', () => {
    orginNode = { ...data };
  });
  flowChart.on('node:click', () => {
    orginNode = { ...data };
  })
  flowChart.on('node:dblclick', () => {
    orginNode = { ...data };
  });

  const onValidateNode = (node) => {
    const sourceNode = node.getProp();
    if (node.shape === 'node-background') {
      flowChart.trigger('graph:showAddMusicModal');
      return false;
    } else if (node.shape === 'node-AtoV') {
      flowChart.trigger('graph:showAtoVModal');
      return false;
    } else if (node.shape === 'node-transient' || node.shape === 'node-continues') {
      if (!isNull(orginNode.x)) {
        // store.selection.selectEvent(sourceNode.id!);
        flowChart.trigger('graph:showGroupModal', { orginNode, sourceNode });
        orginNode = { ...data };
        return false;
      }
    } else if (node.shape === 'node-group') {
      if (!isNull(orginNode.x)) {
        // store.selection.selectGroup(sourceNode.id!);
        flowChart.trigger('graph:showGroupModal', { orginNode, sourceNode });
        orginNode = { ...data };
        return false;
      }
    } else if (node.type === 'library') {
      if (!isNull(orginNode.x)) {
        flowChart.trigger('graph:showGroupModal', { orginNode, sourceNode });
        orginNode = { ...data };
        return false;
      }
    }
    return true;
  }

  const dnd = useMemo(() => new Dnd({
    target: flowChart,
    scaled: true,
    validateNode: onValidateNode
  }), [flowChart]);

  const [groups, setGroups] = useState<Array<IGroupItem>>([]);
  const [basicGroups, setBaiscGroups] = useState<IGroupItem[]>([]);

  useEffect(() => {
    async function getLibraryItem() {
      const typeArr = await ipcRenderer.invoke(LIST_LIB_TYPE);

      if (!isUndefined(typeArr)) {
        typeArr.map(async type => {
          const arr = await ipcRenderer.invoke(LIST_LIB_ON_TYPE, type)
          setGroups(prevGroup => [...prevGroup, { key: 'library', name: type, cellTypes: arr }]);
        })
      }
    }
    getLibraryItem();
    setBaiscGroups(BASIC_GROUP);
  }, [])

  return (
    <div className={STYLES.wrap}>
      <div className={STYLES.content}>
        <Title title='Drop the items into the builder' />
        <Search />
      </div>
      <div className={STYLES.content}>
        <Title title='Basic' />
        <div className={STYLES.graph} id="AssetsBasic">
          {basicGroups.map((group, index) => (
            <PanelContent key={group.name + index} dnd={dnd} cellTypes={group.cellTypes} />
          ))}
        </div>

        { store.currentTab.type === 'Root' && 
          <>
            <Title title='Pattern Library' />
            <div className={STYLES.graph} id="AssetsLibrary">
            <Collapse
              className={STYLES.collapse}
              defaultActiveKey={['general', 'custom']}
            >
              {
                groups.map((group, index) => (
                  <Panel key={group.name + index} header={group.name}>
                    <PanelContent dnd={dnd} cellTypes={group.cellTypes} />
                  </Panel>
                ))
              }
            </Collapse>
            </div>
          </>
        }
      </div>
    </div>
  )
})

export default Assets;