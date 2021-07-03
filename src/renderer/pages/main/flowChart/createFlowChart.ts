// import shortcuts from '../../common/shortcuts';
import { Cell, Edge, EdgeView, Graph, Node, Shape } from '@antv/x6';
import { message } from 'antd';
import { baseCellSchemaMap } from '@/common/baseCell';

// import { libCellSchemaArray } from '@/common/libCell';
// import { baseToolSchemaMap } from '@/common/toolsCell';
import { X6DataFormart } from '@/utils/x6-data-util';
import {
  addTransient,
  addContinuous,
  addGroup,
  getTime,
  setRepeat,
  setCurve,
  canAddEvent,
  canAddPkg
} from '@/cmd';
import store, { undoManager } from '@/stores';
import { addHeAsGroup, transientDuration } from '@/utils/he-utils';
import { isUndefined } from 'lodash';
import { LIST_LIB, LOAD_LIB } from '@/../share/define/message';
import { HeV1, HeV2 } from '@/../share/data/IRichTap';
import { IpcImportLibProps } from '@/../share/define/ipc';

// import item from '../../../common/libCell/schema';
import item from '@/common/libCell/schema';
const { ipcRenderer } = window;

const originNode = {
  cell: {},
  x: null,
  y: null
}

// X6 register base cell shape
Object.values(baseCellSchemaMap).forEach((schema) => {
  const { base, ...rest } = schema;
  base.define(rest);
});

ipcRenderer.invoke(LIST_LIB).then(libs => {
  libs.map(name => {
    const { base, ...rest } = item(name);
    base.define(rest);
  })
})

const showPorts = (ports: NodeListOf<SVGAElement>, show: boolean) => {
  for (let i = 0, len = ports.length; i < len; i = i + 1) {
    ports[i].style.visibility = show ? 'visible' : 'hidden'
  }
}

// const registerTools = (flowChart: Graph): void => {
//   Object.values(baseToolSchemaMap).forEach((tool) => {
//     const { name, ...rest } = tool;
//     console.info(name, rest);
//     flowChart.registerNodeTool(name, rest, true);
//   })
// }

const registerEvents = (flowChart: Graph, container: HTMLDivElement): void => {
  flowChart.on('node:added', (args) => {
    const cell = args.cell as Cell;
    const node = args.node as Node;
    const sourceNode = cell.getProp();
    const project = store.current;

    if (sourceNode.type === 'transient') {
      const end = getTime();
      if (canAddEvent(end, transientDuration(50))) {
        undoManager.get(project!.id).startGroup(() => addTransient(end));
        undoManager.get(project!.id).stopGroup();
      }
      else {
        node.setVisible(false);
        message.error(`Current time ${end} can't insert transient`);
      }
    } else if (sourceNode.type === 'continues') {
      const end = getTime();
      if (canAddEvent(end, 200)) {
        undoManager.get(project!.id).startGroup(() => addContinuous(end));
        undoManager.get(project!.id).stopGroup();
      }
      else {
        node.setVisible(false);
        message.error(`Current time ${end} can't insert continues`);
      }
    } else if (sourceNode.type === 'group') {
      const end = getTime();
      if (canAddPkg(end, 100)) {
        undoManager.get(project!.id).startGroup(() => addGroup(end));
        undoManager.get(project!.id).stopGroup();
      }
      else {
        node.setVisible(false);
        message.error(`Current time ${end} can't insert group`);
      }
    } else if (sourceNode.type === 'AtoV') {
      flowChart.trigger('graph:showAtoVModal');
    } else if (sourceNode.type === 'background') {
      flowChart.trigger('graph:showAddMusicModal');
    } else if (sourceNode.type === 'repeat') {
      setRepeat();
    } else if (sourceNode.type === 'curve') {
      setCurve();
    } else if (sourceNode.type === 'library') {
      const tab = store.currentTab;
      if (!isUndefined(project) && !isUndefined(tab)) {
        const label = sourceNode.attrs!.label.text;
        ipcRenderer.invoke(LOAD_LIB, project.name, label).then((r: IpcImportLibProps) => {
          if (isUndefined(r)) return;
          let obj: HeV1 | HeV2;
          if (r.vibration.version === 1) {
            obj = JSON.parse(r.vibration.data) as HeV1;
          }
          else if (r.vibration.version === 2) {
            obj = JSON.parse(r.vibration.data) as HeV2;
          }
          else
            return;
          const id = tab.rootid;
          if (!!obj) {
            const end = getTime();
            if (canAddPkg(end, 0)) {
              undoManager.get(id).startGroup(() => addHeAsGroup(end, r.vibration.name, obj, r.audio));
              undoManager.get(id).stopGroup();
            }
            else
              message.error(`Current time ${end} has deployed assets`);
          };
        })
      }
    }
    flowChart.cleanSelection();
    // flowChart.select(args.cell);
    // clickTransient(sourceNode.id);
  });

  flowChart.on('node:click', (args) => {
    const { e, cell } = args;
    e.stopPropagation();
    const { clientX, clientY } = e;
    originNode.cell = cell;
    originNode.x = clientX;
    originNode.y = clientY;

    const sourceNode = cell.getProp();
    const _repeat = sourceNode.repeat;
    switch (sourceNode.type) {
      case "transient":
        store.selection.selectEvent(sourceNode.id!);
        store.selector.setStart(sourceNode.relativeTime);
        store.selector.setEnd(sourceNode.relativeTime + sourceNode.duration * _repeat.times + _repeat.interval * (_repeat.times - 1));
        break;
      case "continues":
        store.selection.selectEvent(sourceNode.id!);
        store.selector.setStart(sourceNode.relativeTime);
        store.selector.setEnd(sourceNode.relativeTime + sourceNode.duration * _repeat.times + _repeat.interval * (_repeat.times - 1));
        break;
      case "group":
        store.selection.selectGroup(sourceNode.id!);
        store.selector.setStart(sourceNode.relativeTime);
        store.selector.setEnd(store.current!.groups!.get(sourceNode.id!)!.endWithRepeat!);
        break;
      case "AtoV":
        store.selection.selectA2V(sourceNode.id!);
        store.selector.setStart(sourceNode.relativeTime);
        store.selector.setEnd(store.current!.a2vs!.get(sourceNode.id!)!.endWithRepeat!);
        break;
      case "background":
        store.selection.selectBG();
        break;
      case "repeat":
        store.selection.selectRepeat(sourceNode.type!, sourceNode.type.id!);
        break;
      default:
        break;
    }

    return originNode;
  })

  // flowChart.on('selection:changed', () => {
  //   flowChart.trigger('toolBar:forceUpdate');
  //   flowChart.trigger('settingBar:forceUpdate');
  // });
  flowChart.on('edge:connected', (args) => {
    const edge = args.edge as Edge;
    const sourceNode = edge.getSourceNode() as Node;
    if (sourceNode && sourceNode.shape === 'imove-branch') {
      const portId = edge.getSourcePortId();
      if (portId === 'right' || portId === 'bottom') {
        edge.setLabelAt(0, sourceNode.getPortProp(portId, 'attrs/text/text'));
        sourceNode.setPortProp(portId, 'attrs/text/text', '');
      }
    }
  });
  // flowChart.on('edge:selected', (args) => {
  //   args.edge.attr('line/stroke', '#feb663');
  //   args.edge.attr('line/strokeWidth', '3px');
  // });
  // flowChart.on('edge:unselected', (args) => {
  //   args.edge.attr('line/stroke', '#333');
  //   args.edge.attr('line/strokeWidth', '2px');
  // });
  // flowChart.on('edge:mouseover', (args) => {
  //   args.edge.attr('line/stroke', '#feb663');
  //   args.edge.attr('line/strokeWidth', '3px');
  // });
  flowChart.on(
    'node:mouseenter', (args) => {
      const ports = container.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGAElement>
      showPorts(ports, true);
    }
  )
  flowChart.on('node:mouseleave', () => {
    const ports = container.querySelectorAll(
      '.x6-port-body',
    ) as NodeListOf<SVGAElement>
    showPorts(ports, false)
  })

  flowChart.on('node:dblclick', (args) => {
    const cell = args.cell as Cell;
    const sourceNode = cell.getProp();
    if (sourceNode.type === 'group') {
      const rootid = store.currentTab!.rootid;
      const step = undoManager.get(rootid).undoLevels;
      store.currentTab!.goToGroup(sourceNode.id!, sourceNode.name, step, store.focusGroup!.duration);
      store.selection.selectGroup(sourceNode.id!);
      store.selection.setInd('Pointer');
      store.selector.setStart(0);
      store.selector.setEnd(store.focusGroup!.duration);
    } else if (sourceNode.type === 'AtoV') {
      const rootid = store.currentTab!.rootid;
      const step = undoManager.get(rootid).undoLevels;
      store.currentTab!.goToA2V(sourceNode.id!, sourceNode.name, step, store.focusA2V!.duration);
      store.selection.selectA2V(sourceNode.id!);
      store.selection.setInd('Pointer');
      store.selector.setStart(0);
      store.selector.setEnd(store.focusA2V!.duration);
    }
  });
  flowChart.on('blank:click', (args) => {
    if (store.currentTab) {
      switch (store.currentTab!.type) {
        case 'Root':
          store.selection.selectRoot(); break;
        case 'Group':
          store.selection.selectGroup(store.currentTab!.id); break;
        case 'A2V':
          store.selection.selectA2V(store.currentTab!.id); break;
        default:
          break;
      }
    }
  });

  flowChart.on('blank:contextmenu', (args) => {
    const {
      e: { x, y },
    } = args;
    flowChart.cleanSelection();
    flowChart.trigger('graph:showContextMenu', {
      x: x,
      y: y,
      scene: 'blank',
    });
  });
  flowChart.on('node:contextmenu', (args) => {
    const {
      e: { clientX, clientY },
    } = args;
    // const { x, y } = args;
    flowChart.trigger('graph:showContextMenu', {
      x: clientX,
      y: clientY,
      scene: 'node',
    });
  });
};


const createFlowChart = (
  container: HTMLDivElement
): Graph => {
  const flowChart = new Graph({
    container,
    autoResize: true,
    // https://x6.antv.vision/zh/docs/tutorial/basic/clipboard
    clipboard: {
      enabled: true,
    },
    // https://x6.antv.vision/zh/docs/tutorial/intermediate/connector
    connecting: {
      anchor: 'center',
      connectionPoint: 'anchor',
      allowBlank: false, //是否允许连接到画布空白位置的点
      highlight: true,
      snap: true,  //当 snap 设置为 true 时连线的过程中距离节点或者连接桩 50px 时会触发自动吸附，可以通过配置 radius 属性自定义触发吸附的距离
      validateMagnet({ cell, magnet }) {
        let count = 0
        const connectionCount = magnet.getAttribute('connection-count')
        const max = connectionCount ? parseInt(connectionCount, 10) : Number.MAX_SAFE_INTEGER
        const outgoingEdges = this.getOutgoingEdges(cell)
        if (outgoingEdges) {
          outgoingEdges.forEach((edge: Edge) => {
            const edgeView = this.findViewByCell(edge) as EdgeView
            if (edgeView.sourceMagnet === magnet) {
              count += 1
            }
          })
        }
        return count < max
      },
      createEdge() {  //连接的过程中创建新的边
        return new Shape.Edge({
          attrs: {
            line: {
              stroke: '#fff',
              strokeWidth: 1,
              targetMarker: {
                name: 'classic',
                size: 6,
              },
            },
          },
          connector: { name: 'smooth' },
          zIndex: 0,
        })
      },
      validateConnection({
        sourceView,
        targetView,
        sourceMagnet,
        targetMagnet,
      }) {
        if (sourceView === targetView) {
          return false
        }
        if (!sourceMagnet) {
          return false
        }
        if (!targetMagnet) {
          return false
        }
        return true
      },
    },
    // https://x6.antv.vision/zh/docs/tutorial/basic/selection
    selecting: {
      enabled: true,         //启用框选 
      multiple: true,       //是否启用点击多选
      // rubberband: true, //是否启用框选
      movable: true,       //选中的节点可否移动
      showNodeSelectionBox: true,
      filter: ['groupNode'],   //节点过滤器
    },
    // https://x6.antv.vision/zh/docs/tutorial/basic/snapline
    snapline: false,
    // https://x6.antv.vision/zh/docs/tutorial/basic/keyboard
    keyboard: true,
    // https://x6.antv.vision/zh/docs/tutorial/basic/history
    history: {
      enabled: true,
    },
    // https://x6.antv.vision/zh/docs/tutorial/basic/scroller
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
    embedding: {
      enabled: true,
      findParent({ node }) {
        const bbox = node.getBBox()
        return this.getNodes().filter((node) => {
          // 只有 data.parent 为 true 的节点才是父节点
          const data = node.getData<any>()
          if (data && data.parent) {
            const targetBBox = node.getBBox()
            return bbox.isIntersectWithRect(targetBBox)
          }
          return false
        })
      },
    },
  });
  registerEvents(flowChart, container);
  // registerTools(flowChart);
  const { data } = X6DataFormart(flowChart);
  flowChart.fromJSON(data);
  return flowChart;
};

export default createFlowChart;
