import { Button } from '@antv/x6/es/registry/tool/button';

const RepeatTool = Button.define<Button.Options>({
  name: 'tool-repeat',
  markup: [
    {
      tagName: 'rect',
      selector: 'button',
      attrs: {
        width: 40,
        height: 20,
        rx: 4,
        ry: 4,
        fill: 'white',
        stroke: '#fe854f',
        'stroke-width': 2,
        cursor: 'pointer',
      },
    },
    {
      tagName: 'text',
      selector: 'text',
      textContent: 'btn',
      attrs: {
        fill: '#fe854f',
        'font-size': 10,
        'text-anchor': 'middle',
        'pointer-events': 'none',
        x: 20,
        y: 13,
      },
    },
  ],
  onClick({ view }: any) {
    // const node = view.cell;
  }
});
export default RepeatTool;
// Graph.registerNodeTool('my-btn', RepeatTool, true)