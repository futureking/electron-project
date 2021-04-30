const graphData = {
  // 节点
  nodes: [
    {
      id: 'start', // String，可选，节点的唯一标识
      shape: 'circle',
      x: 100,       // Number，必选，节点位置的 x 值
      y: 100,       // Number，必选，节点位置的 y 值
      width: 80,   // Number，可选，节点大小的 width 值
      height: 40,  // Number，可选，节点大小的 height 值
      label: 'start', // String，节点标签
    }
  ],
  // 边
  edges: [
    {
      source: 'start', // String，必须，起始节点 id
      attrs: {
        line: {
          stroke: '#5F95FF',
          strokeWidth: 1
        },
      },
      target: { x: 200, y: 120 },
      connector: { name: 'smooth' },
      zIndex: 0,
    },
  ],
};

export default graphData
