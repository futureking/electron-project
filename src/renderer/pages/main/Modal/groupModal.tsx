import React, { useState, useEffect } from 'react';
import { Graph } from '@antv/x6';
import classnames from 'classnames';
import { addTransient, addContinuous, addGroup } from '@/cmd';
import STYLES from './groupModal.less';
import store, { undoManager } from '@/stores';
import { isUndefined } from 'lodash';

interface IProps {
  flowChart: Graph;
}
interface orginType {
  node: any,
  x: null | number,
  y: null | number
}

const GropuModal: React.FC<IProps> = (props) => {
  const { flowChart } = props;
  //visible 控制弹窗显示
  const [visible, setVisible] = useState<boolean>(false);
  //当前节点
  const [currentNode, setCurrentNode] = useState<any>();
  //目标节点
  const [orginNode, setOrginNode] = useState<orginType>({ node: {}, x: null, y: null });
  // life
  const handler = (data) => {
    const { orginNode, sourceNode } = data;
    setOrginNode(orginNode);
    setCurrentNode(sourceNode);
    setVisible(true);
  };
  useEffect(() => {
    flowChart.on('graph:showGroupModal', handler);
    return () => {
      flowChart.off('graph:showGroupModal', handler);
    };
  }, []);

  //替换按钮  操作
  const onReplace = () => {
    const node = orginNode.node;
    const time = node.store!.data.relativeTime;
    if (node.shape === 'node-group') {
      store.current!.deleteGroup(node.id!)
    } else if (node.shape === 'node-transient' || node.shape === 'node-continues') {
      store.current!.deleteEvent(node.id!);
    } else if (node.shape === 'node-AtoV') {
      store.current!.deleteA2V(node.id!);
    }
    switch (currentNode.type!) {
      case 'transient':
        addTransient(time);
        break;
      case 'continues':
        addContinuous(time);
        break;
      case 'group':
        addGroup(time);
        break;
    }
    setVisible(false);
  }

  const onFrontFunc = () => {
    const node = orginNode.node;
    let time = node!.store.data.relativeTime;
    const tab = store.currentTab;
    if (tab.type === 'Group')
      time += store.currentGroup.start;
    else if (tab.type === 'A2V')
      time += store.currentA2V.start;
    console.log('onFrontFunc', time);
    switch (currentNode.type!) {
      case 'transient':
        addTransient(time);
        break;
      case 'continues':
        addContinuous(time);
        break;
      case 'group':
        addGroup(time);
        break;
    }
    setVisible(false);
  }

  const onEndFunc = () => {
    const node = orginNode.node;
    const project = store.current;
    // console.log(node.id, node.shape);
    let time;
    const tab = store.currentTab;
    switch (tab.type) {
      case 'Root':
        if (node.shape === 'node-group') {
          time = project.groups.get(node.id)!.endWithRepeat;
        }
        else if (node.shape === 'node-transient' || node.shape === 'node-continues') {
          time = project.events.get(node.id).endWithRepeat;
        }
        else if (node.shape === 'node-AtoV') {
          time = project.a2vs.get(node.id)!.endWithRepeat;
        }
        break;
      case 'Group':
        const group = store.currentGroup;
        time = group.events.get(node.id).endWithRepeat + group.start;
        break;
      case 'A2V':
        const a2v = store.currentA2V;
        time = a2v.events.get(node.id).endWithRepeat + a2v.start;
        break;
    }
    if (isUndefined(time)) {
      return;
    }
    console.log('onEndFunc', time);
    switch (currentNode.type!) {
      case 'transient':
        addTransient(time);
        break;
      case 'continues':
        addContinuous(time);
        break;
      case 'group':
        addGroup(time);
        break;
    }
    setVisible(false);
  }

  //取消按钮 操作
  const onCancle = () => {
    setVisible(false);
  }

  const project = store.current;
  return (
    <div className={STYLES.wrap} style={{ display: visible ? 'flex' : 'none', top: orginNode!.y || 0 + 'px', left: orginNode!.x || 0 + 130 + 'px' }}>
      <div className={classnames(STYLES.block, STYLES.left)} onClick={() => {
        undoManager.get(project!.id).startGroup(() => onFrontFunc());
        undoManager.get(project!.id).stopGroup();
      }}>
        <i><img src={require('./imgs/front.svg')} alt="" /></i>
      </div>
      <div className={classnames(STYLES.center)}>
        <div className={classnames(STYLES.block, STYLES.center_block)}>
          <i><img src={require('./imgs/repeat.svg')} alt="" /></i>
        </div>
        <div className={classnames(STYLES.block, STYLES.center_block)} onClick={() => {
          undoManager.get(project!.id).startGroup(() => onReplace());
          undoManager.get(project!.id).stopGroup();
        }}>
          <i><img src={require('./imgs/replace.svg')} alt="" /></i>
        </div>
        <div className={classnames(STYLES.block, STYLES.center_block)} onClick={onCancle}>
          <span>取消</span>
        </div>
      </div>
      <div className={classnames(STYLES.block, STYLES.right)} onClick={() => {
        undoManager.get(project!.id).startGroup(() => onEndFunc());
        undoManager.get(project!.id).stopGroup();
      }}>
        <i><img src={require('./imgs/end.svg')} /></i>
      </div>
    </div >
  )
}

export default GropuModal;