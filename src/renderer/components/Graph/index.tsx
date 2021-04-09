import { Graph, Addon, FunctionExt, Shape } from '@antv/x6'
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
    this.initShape()
    this.initGraphShape()
    this.initEvent()
    return this.graph
  }

  private static initStencil() {
    this.stencil = new Addon.Stencil({
      target: this.graph,
      stencilGraphWidth: 280,
      search: { rect: true },
      collapsable: true,
      groups: [
        {
          name: 'basic',
          title: '基础节点',
          graphHeight: 180,
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
    const { graph } = this
    const r1 = graph.createNode({
      shape: 'flow-chart-rect1',
      attrs: {
        body: {
          rx: 20,
          ry: 20,
        },
        text: {
          textWrap: {
            text: '起始节点',
            fill: '#fff'
          },
        },
        label: {
          fill: '#fff'
        }
      },
    })
    const r2 = graph.createNode({
      shape: 'flow-chart-rect1',
      attrs: {
        text: {
          textWrap: {
            text: '流程节点',
          },
        },
      },
    })
    const r3 = graph.createNode({
      shape: 'flow-chart-rect1',
      width: 42,
      height: 42,
      angle: 45,
      attrs: {
        'edit-text': {
          style: {
            transform: 'rotate(-45deg)',
          },
        },
        text: {
          textWrap: {
            text: '判断节点',
          },
          transform: 'rotate(-45deg)',
        },
      },
      ports: {
        groups: {
          top: {
            position: {
              name: 'top',
              args: {
                dx: 0,
              },
            },
          },
          right: {
            position: {
              name: 'right',
              args: {
                dy: 0,
              },
            },
          },
          bottom: {
            position: {
              name: 'bottom',
              args: {
                dx: 0,
              },
            },
          },
          left: {
            position: {
              name: 'left',
              args: {
                dy: 0,
              },
            },
          },
        },
      },
    })
    const r4 = graph.createNode({
      shape: 'flow-chart-rect1',
      width: 50,
      height: 50,
      attrs: {
        body: {
          rx: 35,
          ry: 35,
        },
        text: {
          textWrap: {
            text: '链接节点',
          },
        },
      },
    })
    this.stencil.load([r1, r2, r3, r4], 'basic')
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
