import React from 'react';
import { Button } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import FlowGraph from '@/components/Graph';
import store from '@/stores';
import STYLES from './index.less';

const ButtonGroup = Button.Group;

const GraphZoom: React.FC<{
  zoom?: string;
}> = ({ zoom }) => {
  
  const graph = FlowGraph.init();
  console.info(graph.options.scaling);
  const pid = store.selection.pid;
  const projects = store.projectStore.projects;
  console.info(projects.get(pid)!)
  const decline = () => {

  };

  const increase = () => {

  };

  return(
    <div className={STYLES.wrap}>
      <ButtonGroup>
        <Button onClick={decline}>
          <MinusOutlined />
        </Button>
        <Button onClick={increase}>
          <PlusOutlined />
        </Button>
      </ButtonGroup>
    </div>
  )
};

export default GraphZoom