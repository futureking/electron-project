import { Shape } from '@antv/x6';

const schema = {
  base: Shape.Rect,
  shape: 'node-transient',
  width: 80,
  height: 80,
  label: 'transient',
  attrs: {
    body: {
      fill: '#333',
      strokeWidth: 1,
      stroke: '#333',
    },
    label: {
      fill: '#FFF',
      textWrap: { width: '100%' },
    },
  },
  ports: {
    groups: {
      top: {
        position: 'top',
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
      bottom: {
        position: 'bottom',
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
        id: 'top',
        group: 'top',
      },
      {
        id: 'right',
        group: 'right',
      },
      {
        id: 'bottom',
        group: 'bottom',
      },
      {
        id: 'left',
        group: 'left',
      },
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
