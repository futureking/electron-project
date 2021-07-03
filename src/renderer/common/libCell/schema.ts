import { Shape } from '@antv/x6';

const schema = (name: string) => {
  return {
    base: Shape.Rect,
    // shape: 'node-'+name.toLowerCase().replace(' ', ''),
    shape: name,
    width: 92,
    height: 57,
    // label: name,
    type: 'library',
    attrs: {
      body: {
        fill: '#2FBEE8',
        rx: 4
      },
      label: {
        text: name,
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
  }
};

export default schema;
