const graphData = {
  // 节点
  nodes: [
    {
      id: '2d797c87-3780-4278-86c3-a4dda00f6f71', // String，可选，节点的唯一标识
      shape: 'rect',
      x: 100,       // Number，必选，节点位置的 x 值
      y: 100,       // Number，必选，节点位置的 y 值
      width: 80,   // Number，可选，节点大小的 width 值
      height: 50,  // Number，可选，节点大小的 height 值
      label: 'Transient', // String，节点标签
      attrs: {
        body: {
          // stroke: '#9254de',
          fill: '#36AFD2',
          rx: '4px',
          ry: '4px'
        }
      },
      ports: [
        {
          position: 'left',
          label: {
            position: 'left',
          },
          attrs: {
            circle: {
              r: 6,
              magnet: true,
            }
          }
        }
      ]
    },
    {
      id: 'df1bba63-cc35-42a7-bfa3-12be2f7cad84', // String，可选，节点的唯一标识
      shape: 'rect',
      x: 250,       // Number，必选，节点位置的 x 值
      y: 100,       // Number，必选，节点位置的 y 值
      width: 80,   // Number，可选，节点大小的 width 值
      height: 50,  // Number，可选，节点大小的 height 值
      label: 'Continuous', // String，节点标签
      attrs: {
        body: {
          // stroke: '#9254de',
          fill: '#D5C854',
          rx: '4px',
          ry: '4px'
        }
      },
      ports: [
        {
          position: 'left',
          label: {
            position: 'left',
          },
          attrs: {
            circle: {
              r: 6,
              magnet: true,
            }
          }
        }
      ]
    }
  ],
  // 边
  edges: [
    {
      source: '2d797c87-3780-4278-86c3-a4dda00f6f71', // String，必须，起始节点 id
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
}

export default graphData
