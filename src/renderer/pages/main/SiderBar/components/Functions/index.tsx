import React, { useState, useEffect, useMemo } from 'react';
import { Addon, Node, Graph } from '@antv/x6';
import { PlusOutlined } from '@ant-design/icons';
import cellMap from '@/common/previewCell';
import STYLES from './index.less';
import store from '@/stores';
import { observer } from 'mobx-react-lite';

const { Dnd } = Addon;

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
    cellTypes: ['node-curve', 'node-repeat']
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

const onValidateNode = (node) => {
  if(node!.shape === 'node-curve') {
    if(store.currentTab!.type === 'Root') {
      if( store.focusEvent && store.focusEvent!.type === 'Continuous') {
        if(!store.focusEvent.curveeditable) 
          return true;
        else 
          return false;
      }else {
        return false;
      }
    }else if (store.currentTab!.type === 'Group') {
      if( store.focusEvent &&  store.focusEvent!.type === 'Continuous') {
        if(!store.focusEvent.curveeditable) 
          return true;
        else 
          return false;
      }else {
        return false;
      }
    }else if (store.currentTab!.type === 'A2V') {
      if( store.focusEvent &&  store.focusEvent!.type === 'Continuous') {
        if(!store.focusEvent.curveeditable) 
          return true;
        else 
          return false;
      }else {
        return false;
      }
    }
  }else if(node.shape === 'node-repeat') {
    if(store.currentTab!.type === 'Root') { 
      if(store.focusEvent){
        if(!store.focusEvent.repeateditable) {
          return true
        }else {
          return false
        }
      }else if(store.focusGroup){
        if(!store.focusEvent.repeateditable) {
          return true
        }else {
          return false
        }
      }else if(store.focusA2V){
        if(!store.focusEvent.repeateditable) {
          return true
        }else {
          return false
        }
      }else{
        return false
      };
    }else if(store.currentTab!.type === 'Group') {
      if(store.focusEvent){
        if(!store.focusEvent.repeateditable) {
          return true
        }else {
          return false
        }
      }else{
        return false
      };
    }else if(store.currentTab!.type === 'A2V') {
      if(store.focusEvent){
        if(!store.focusEvent.repeateditable) {
          return true
        }else {
          return false
        }
      }else{
        return false
      };
    }
      
    // if(store.focusEvent || store.focusGroup || store.focusA2V) {
    //   if(store.focusEvent && !store.focusEvent.repeateditable) 
    //     return true;
    //   else if( store.focusGroup && !store.focusGroup.repeateditable )
    //     return true;
    //   else if(store.focusA2V && !store.focusA2V.repeateditable)
    //     return true;
    //   else 
    //     return false;
    // }else {
    //   return false;
    // }
  }
  return true;
}

const FunctionComp: React.FC<Iprops> =observer((props) => {
  const { flowChart } = props;
  const dnd = useMemo(() => new Dnd({ 
    target: flowChart, 
    scaled: true,
    validateNode: onValidateNode
  }), [flowChart]);

  const [groups, setGroups] = useState<IGroupItem[]>([]);

  useEffect(() => {
    setGroups(GENERAL_GROUP);
  }, [])

  return(
    <div className={STYLES.wrap}>
      <div className={STYLES.content}>
        <Title title='Basic Function' />
        <div className={STYLES.graph} id="AssetsBasic">
          {groups.map((group, index) => (
            <PanelContent key={group.name+index} dnd={dnd} cellTypes={group.cellTypes} />
          ))}
        </div>
      </div>
    </div>
  )
})

export default FunctionComp;