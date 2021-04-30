import React, { useLayoutEffect } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Graph } from '@antv/x6';
import CustomNode from '@/components/Nodes';
import STYLES from './index.less';
// let container: HTMLDivElement;
let graph: Graph;

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
}

const Assets: React.FC = () => {

  useLayoutEffect(() => {
    init();
  }, []);


  const init = () => {
    let newGraph = new Graph({
      container: document.getElementById('container')!,
      history: true,
      grid: true,
      snapline: {
        enabled: true,
        sharp: true,
      },
      //滚动画布
      scroller: {
        enabled: true,
        pageVisible: false,
        pageBreak: false,
        pannable: true,
      },
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
      },
    });
    Graph.registerNode(
      'custom-rect',
      {
        inherit: 'rect',
        width: 300,
        height: 40,
        attrs: {
          body: {
            rx: 10, // 圆角矩形
            ry: 10,
            strokeWidth: 1,
            stroke: '#5755a1',
            fill: '#5755a1',
          },
          label: {
            textAnchor: 'left', // 左对齐
            refX: 10, // x 轴偏移量
            fill: '#ffffff',
            fontSize: 18,
          },
        },
      },
      true,
    )
    newGraph.centerContent();
    const source = newGraph.addNode({
      x: 40,
      y: 40,
      shape: 'custom-rect',
      label: 'Custom Rectangle',
      component: <CustomNode text="Hello" imgSrc={''} />,
    })
    newGraph.addEdge({
      source
    })
    graph = newGraph;
    return graph
  }

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
      </div>
    </div>
  )
}

export default Assets;