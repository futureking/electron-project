import { Graph, Addon, FunctionExt, Shape } from '@antv/x6'
import '@antv/x6-react-shape'
import CustomNode from '../Nodes';
import './shape'
import graphData from './data'

export default class FlowGraph {
  public static graph: Graph
  private static stencil: Addon.Stencil

  public static init() {
    this.graph = new Graph({
      container: document.getElementById('container')!,
      autoResize: true,
      //滚动画布
      scroller: {
        // enabled: true,
        // pannable: true,    //是否启用画布平移能力
        pageVisible: false,  //是否分页
        pageBreak: false,   //是否显示分页符
      },
      mousewheel: {
        enabled: true,
        modifiers: ['ctrl', 'meta'],
      },
      //点选、框选
      selecting: {
        enabled: true,
        multiple: true,
        rubberband: true,
        movable: true,
        showNodeSelectionBox: true,
        filter: ['groupNode'],
      },
      //连线选项
      connecting: {
        anchor: 'center',
        connectionPoint: 'anchor',
        allowBlank: false,
        highlight: true,
        snap: true,
        createEdge() {
          return new Shape.Edge({
            attrs: {
              line: {
                stroke: '#5F95FF',
                strokeWidth: 1,
                targetMarker: {
                  name: 'classic',
                  size: 8,
                },
              },
            },
            connector: { name: 'smooth' },
            // router: {
            //   name: 'manhattan',
            // },
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

  private static initStencil2() {
    this.stencil = new Addon.Stencil({
      target: this.graph,
      stencilGraphWidth: 280,
      search: { rect: true },
      groups: [
        {
          name: 'basic',
          title: '基础节点',
          graphHeight: 180,
          collapsable: false
        },
        // {
        //   name: 'combination',
        //   title: '组合节点',
        //   layoutOptions: {
        //     columns: 1,
        //     marginX: 60,
        //   },
        //   graphHeight: 260,
        // },
        // {
        //   name: 'group',
        //   title: '节点组',
        //   graphHeight: 100,
        //   layoutOptions: {
        //     columns: 1,
        //     marginX: 60,
        //   },
        // },
      ],
    })
    const stencilContainer = document.querySelector('#stencil2')
    stencilContainer?.appendChild(this.stencil.container)
  }

  private static initStencil() {
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
        },
        // {
        //   name: 'combination',
        //   title: '组合节点',
        //   layoutOptions: {
        //     columns: 1,
        //     marginX: 60,
        //   },
        //   graphHeight: 260,
        // },
        // {
        //   name: 'group',
        //   title: '节点组',
        //   graphHeight: 100,
        //   layoutOptions: {
        //     columns: 1,
        //     marginX: 60,
        //   },
        // },
      ],
    })
    const stencilContainer = document.querySelector('#stencil')
    stencilContainer?.appendChild(this.stencil.container)
  }

  private static initShape() {
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
      component: <CustomNode text="Transient" imgSrc={require('../Nodes/imgs/bg_transient.svg')} />,
      ports: unitPort,
    })

    const ContinueNode = graph.createNode({
      x: 40,
      y: 40,
      width: 60,
      height: 40,
      shape: 'react-shape',
      ports: unitPort,
      component: <CustomNode text="Continues" imgSrc={require('../Nodes/imgs/bg_continues.svg')} />,
    })

    const GroupNode = graph.createNode({
      x: 40,
      y: 40,
      width: 60,
      height: 40,
      shape: 'react-shape',
      ports: unitPort,
      component: <CustomNode text="Group" imgSrc={require('../Nodes/imgs/bg_group.svg')} />,
    })

    const AtoVNode = graph.createNode({
      x: 40,
      y: 40,
      width: 60,
      height: 40,
      ports: unitPort,
      shape: 'react-shape',
      component: <CustomNode text="A to V" imgSrc={require('../Nodes/imgs/bg_AtoV.svg')} />,
    })

    const MusicNode = graph.createNode({
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      shape: 'react-shape',
      ports: unitPort,
      component: <CustomNode text="Background Music" imgSrc={require('../Nodes/imgs/bg_bgmusic.svg')} />,
    })
    this.stencil.load([TransientNode, ContinueNode, GroupNode, AtoVNode, MusicNode], 'basic')
  }

  private static initGraphShape() {
    this.graph.fromJSON(graphData as any)
  }

  private static showPorts(ports: NodeListOf<SVGAElement>, show: boolean) {
    for (let i = 0, len = ports.length; i < len; i = i + 1) {
      ports[i].style.visibility = show ? 'visible' : 'hidden'
    }
  }

  private static initEvent() {
    const { graph } = this
    const container = document.getElementById('container')!

    graph.on('node:contextmenu', ({ cell, view }) => {
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
    graph.on('node:mouseleave', () => {
      const ports = container.querySelectorAll(
        '.x6-port-body',
      ) as NodeListOf<SVGAElement>
      this.showPorts(ports, false)
    })

    graph.on('node:collapse', ({ node, e }) => {
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
      if (cell.shape !== 'groupNode') {
        cell.toFront()
      }
    })

    graph.bindKey('backspace', () => {
      const cells = graph.getSelectedCells()
      if (cells.length) {
        graph.removeCells(cells)
      }
    })
  }
}
