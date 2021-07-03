import { Shape } from '@antv/x6';

const schema = {
  base: Shape.Rect,
  shape: 'node-continues',
  width: 92,
  height: 57,
  label: 'continues',
  type: 'continues',
  attrs: {
    body: {
      fill: '#F4D75C',
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
      }
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
  },
  data: {
    label: '开始',
    configSchema: '{\n  \n}',
    configData: {},
    trigger: 'start',
    dependencies: '{\n  \n}',
    code: 'export default async function(ctx) {\n  \n}',
  },
};

export default schema;
