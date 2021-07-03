import { Shape } from '@antv/x6';

const repeat = {
  base: Shape.Circle,
  shape: 'node-repeat',
  width: 32,
  height: 32,
  type: 'repeat',
  attrs: {
    // body: {
    //   fill: '#D24747',
    //   strokeWidth: 1,
    //   stroke: '#D24747',
    //   rx: 4
    // },
    image: {
      // XLinkHref: require('../../assets/images/repeat.svg'),
      'xlink:href': require('@/assets/images/bg_repeat.svg'),
      width: 32,
      height: 32,
      x: 12,
      y: 12,
    },
    // label: {
    //   fill: '#fff',
    //   textWrap: { width: '100%' },
    // },
  },
  markup: [
    {
      tagName: 'image',
      selector: 'image',
    }
  ],
};

export default repeat;
