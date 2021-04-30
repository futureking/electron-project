import React from 'react';
import { Graph, Edge, EdgeView, Addon, FunctionExt, Shape } from '@antv/x6'
import '@antv/x6-react-shape'
// import AddMusicModal from './components/Modal/AddMusic';
import CustomNode from '../Nodes';
export default class FlowGraph  {
  public static graph: Graph
  private static stencil: Addon.Stencil

  public static init() {
    this.graph = new Graph({
      container: document.getElementById('container')!,
      autoResize: true,  //是否自动扩充/缩小画布，默认为 true
      //滚动画布
      scroller: {
        // enabled: true,
        // pannable: true,    //是否启用画布平移能力
        pageVisible: false,  //是否分页
        pageBreak: false,   //是否显示分页符
      },
      //滚轮的默认行为，避免与scroller冲突
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],  //结合快捷键触发画布缩放
      },
      //点选、框选
      selecting: {
        enabled: true,         //启用框选 
        multiple: true,       //是否启用点击多选
        // rubberband: true, //是否启用框选
        movable: true,       //选中的节点可否移动
        showNodeSelectionBox: true,
        filter: ['groupNode'],   //节点过滤器
      },
      //连线选项
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
                stroke: '#5F95FF',
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
      highlighting: {
        magnetAvailable: {
          name: 'stroke',
          args: {
            padding: 4,
            attrs: {
              strokeWidth: 4,
              stroke: 'rgba(223,234,255)',
            },
          },
        },
      },
      snapline: true,
      history: true,
      clipboard: {
        enabled: true,
      },
      keyboard: {
        enabled: true,
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
    })
    this.initStencil()
    // this.initStencil2()
    this.initShape()
    this.initGraphShape()
    this.initEvent()
    return this.graph
  }


  public static initStencil() {
    this.stencil = new Addon.Stencil({
      target: this.graph,
      title: 'Drop the items into the builder',
      stencilGraphWidth: 280,
      search: { rect: true },
      collapsable: false,
      groups: [
        {
          name: 'basic',
          title: 'Basic',
          graphHeight: 180,
          collapsable: false,
        }
      ]
    })
    const stencilContainer = document.querySelector('#stencil')
    stencilContainer?.appendChild(this.stencil.container)
  }

  public static initShape() {
    const { graph } = this;

    const unitPort = {
      groups: {
        right: {
          position: 'right',
          attrs: {
            circle: {
              r: 3,
              magnet: true,
              stroke: '#5F95FF',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
              connectionCount: 2
            },
          },
        },
        left: {
          position: 'left',
          attrs: {
            circle: {
              r: 3,
              magnet: true,
              stroke: '#5F95FF',
              strokeWidth: 1,
              fill: '#fff',
              style: {
                visibility: 'hidden',
              },
              connectionCount: 0
            },
          },
        },
      },
      items: [
        {
          group: 'right',
        },
        {
          group: 'left',
        },
      ],
    };

    const TransientNode = graph.createNode({
      x: 40,
      y: 40,
      width: 60,
      height: 40,
      shape: 'react-shape',
      ports: unitPort,
      type: 'Transient',
      component: <CustomNode text="Transient" imgSrc={require('../Nodes/imgs/bg_transient.svg')} />,
    })

    const ContinueNode = graph.createNode({
      x: 40,
      y: 40,
      width: 60,
      height: 40,
      shape: 'react-shape',
      ports: unitPort,
      type: 'Continue',
      component: <CustomNode text="Continues" imgSrc={require('../Nodes/imgs/bg_continues.svg')} />,
    })

    const GroupNode = graph.createNode({
      x: 40,
      y: 40,
      width: 60,
      height: 40,
      shape: 'react-shape',
      ports: unitPort,
      type: 'Group',
      component: <CustomNode text="Group" imgSrc={require('../Nodes/imgs/bg_group.svg')} />,
    })

    const AtoVNode = graph.createNode({
      x: 40,
      y: 40,
      width: 60,
      height: 40,
      ports: unitPort,
      shape: 'react-shape',
      type: 'AtoV',
      component: <CustomNode text="A to V" imgSrc={require('../Nodes/imgs/bg_AtoV.svg')} />,
    })

    const MusicNode = graph.createNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      shape: 'react-shape',
      ports: unitPort,
      type: 'Music',
      event: 'graph:editCode',
      component: <CustomNode text="Background Music" imgSrc={require('../Nodes/imgs/bg_bgmusic.svg')} />,
    })
    this.stencil.load([TransientNode, ContinueNode, GroupNode, AtoVNode, MusicNode], 'basic')
  }

  public static initGraphShape() {
    // const graphData = X6DataFormart();
    // console.info(data)
    // this.graph.fromJSON(graphData)
  }

  public static showPorts(ports: NodeListOf<SVGAElement>, show: boolean) {
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = show ? 'visible' : 'hidden'
    }
  }

  public static initEvent() {
    const { graph } = this
    const container = document.getElementById('container')!;

    graph.on('node:added', ({ node, index, options }) => {
      console.info('node:added', node, index, options);
      const data = node.getProp();
      console.info(data)
      if(data.type === 'Music') {
        // return <AddMusicModal visible={true} flowChart={graph} />
        graph.trigger('graph:editCode');
      }
    });

    graph.on('node:contextmenu', ({ cell, view }) => {
      console.info('clicked node:contextmenu');
      const oldText = cell.attr('text/textWrap/text') as string
      const elem = view.container.querySelector('.x6-edit-text') as HTMLElement
      if (elem == null) { return }
      cell.attr('text/style/display', 'none')
      if (elem) {
        elem.style.display = ''
        elem.contentEditable = 'true'
        elem.innerText = oldText
        elem.focus()
      }
      const onBlur = () => {
        cell.attr('text/textWrap/text', elem.innerText)
        cell.attr('text/style/display', '')
        elem.style.display = 'none'
        elem.contentEditable = 'false'
      }
      elem.addEventListener('blur', () => {
        onBlur()
        elem.removeEventListener('blur', onBlur)
      })
    })
    graph.on(
      'node:mouseenter',
      FunctionExt.debounce(() => {
        const ports = container.querySelectorAll(
          '.x6-port-body',
        ) as NodeListOf<SVGAElement>
        this.showPorts(ports, true)
      }),
      500,
    )
    graph.on(
      'node:mouseenter',() => {
        const ports = container.querySelectorAll(
          '.x6-port-body',
        ) as NodeListOf<SVGAElement>
        this.showPorts(ports, true)
      }
    )
    graph.on('node:mouseleave', () => {
      const ports = container.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGAElement>
      this.showPorts(ports, false)
    })

    graph.on('node:collapse', ({ node, e }) => {
      console.info('clicked node:collapse');
      e.stopPropagation()
      node.toggleCollapse()
      const collapsed = node.isCollapsed()
      const cells = node.getDescendants()
      cells.forEach((n) => {
        if (collapsed) {
          n.hide()
        } else {
          n.show()
        }
      })
    })

    graph.on('node:embedded', ({ cell }) => {
      console.info('clicked node:embedded');
      if (cell.shape !== 'groupNode') {
        cell.toFront()
      }
    })

    graph.on('node:dblclick', ({e, x, y, node, view}) => {
      console.info(e, x, y, node, view)
    })

    graph.bindKey('backspace', () => {
      console.info('clicked backspace');
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.removeCells(cells)
      }
    })
  }
}

