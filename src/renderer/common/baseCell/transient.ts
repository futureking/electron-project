import { Shape } from '@antv/x6';

const schema = {
  base: Shape.Rect,
  shape: 'node-transient',
  width: 92,
  height: 57,
  label: 'transient',
  type: 'transient',
  attrs: {
    body: {
      fill: '#2FBEE8',
      rx: 4
    },
    label: {
      fill: '#333',
      textWrap: { width: '100%' },
    },
  },
  ports: {
    groups: {
      right: {
        position: 'right',
        attrs: {
          circle: {
            r: 3,
            magnet: true,
            stroke: '#666',
            strokeWidth: 1,
            fill: '#fff',
          },
        },
      },
      left: {
        position: 'left',
        attrs: {
          circle: {
            r: 3,
            magnet: true,
            stroke: '#666',
            strokeWidth: 1,
            fill: '#fff',
          },
        },
      },
    },
    items: [
      {
        id: 'right',
        group: 'right',
      },
      {
        id: 'left',
        group: 'left',
      }
    ],
  }
};

export default schema;
