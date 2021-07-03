import store from "@/stores";
import { Graph } from '@antv/x6';
import { randomUuid } from '@/utils/utils';
import { transient, continues, group, AtoV } from '@/common/baseCell';

var flowGraph: Graph;
const onRepeatObj = (x?: string) => {
  return {
    name: 'button',
    args: {
      markup: [
        {
          tagName: 'circle',
          selector: 'Rep',
          attrs: {
            r: 14,
            stroke: '#fff',
            strokeWidth: 1,
            fill: '#323842',
            cursor: 'pointer',
          },
        },
        {
          tagName: 'text',
          textContent: 'Rep',
          selector: 'icon',
          attrs: {
            fill: '#fff',
            fontSize: 10,
            textAnchor: 'middle',
            pointerEvents: 'none',
            y: '0.3em',
          }
        },
      ],
      x: x ? x : '50%',
      y: '100%',
      offset: { x: 0, y: 0 },
      onClick: ( args ) => {
        const { cell } = args;
        if(store.selection.focusType === 'Event'  || store.selection.focusType === 'Event-Repeat') {
          store.selection.selectRepeat('Event', cell.id);
        }else if( store.selection.focusType === 'Group' || store.selection.focusType === 'Group-Repeat') {
          store.selection.selectRepeat('Group', cell.id);
        } else if( store.selection.focusType === 'A2V' || store.selection.focusType ==='A2V-Repeat') {
          store.selection.selectRepeat('A2V', cell.id);
        }else {
          return
        }
      },
    },
  }
}

const onCurveObj = (x?: string) => {
  return {
    name: 'button',
    args: {
      markup: [
        {
          tagName: 'circle',
          selector: 'Cur',
          attrs: {
            r: 14,
            stroke: '#fff',
            strokeWidth: 1,
            fill: '#323842',
            cursor: 'pointer',
          },
        },
        {
          tagName: 'text',
          textContent: 'Cur',
          selector: 'icon',
          attrs: {
            fill: '#fff',
            fontSize: 10,
            textAnchor: 'middle',
            pointerEvents: 'none',
            y: '0.3em',
          }
        },
      ],
      x: x ? x : '50%',
      y: '100%',
      offset: { x: 0, y: 0 },
      onClick: ( args ) => {
        const { e, view, cell } = args;
        if(store.focusEvent && store.focusEvent.id === cell.id) {
          flowGraph.trigger("graph:showCurveModal", {e, view, cell});
        }
      }
    },
  }
}

const edgeObj = {
  shape: "edge",
  attrs: {
    line: {
      stroke: '#fff',
      strokeWidth: 1,
      targetMarker: {
        name: 'block',
        size: 6,
      },
    },
  },
  connector: { name: 'smooth' },
  zIndex: 111,
};

const getEdgeTurnObj = (x1: number, y1: number, x2: number, y2: number) => {
  return {
    shape: "edge",
    attrs: {
      line: {
        stroke: '#fff',
        strokeWidth: 1,
        targetMarker: {
          name: 'block',
          size: 6,
        },
      },
    },
    vertices: [
      { x: x1, y: y1 },
      { x: x2, y: y2 }
    ],
    connector: {
      name: 'rounded',
      args: {
        radius: 100
      }
    },
    zIndex: 111,
  }
}

// const projects = store.projects;
const X6DataFormart = (flowChart: Graph) => {
  flowGraph = flowChart;
  const tab = store.currentTab;
  let data = [];
  if (tab) {
    if (tab.type === 'Root') {
      data = ProjectDeal(flowChart);
    } else if (tab.type === 'Group') {
      data = GroupDeal(flowChart);
    } else if(tab.type === 'A2V') {
      data = AtoVDeal(flowChart);
    }
  }
  return{ data, flowGraph };
};

const ProcessData = (dataList, event) => {
  if (event.relativeTime !== null && event.relativeTime != undefined || event.start !== null && event.start !== undefined) {
    const toolList: Array<any> = new Array<any>();
    if (event.repeateditable) {
      if(event.curveeditable) {
        const newObj = onRepeatObj('70%');
        toolList.push(newObj)
      }else {
        const newObj = onRepeatObj();
        toolList.push(newObj)
      }
    }

    if (event.curveeditable) {
      if(event.repeateditable) {
        const newObj = onCurveObj('30%');
        toolList.push(newObj)
      }else {
        const newObj = onCurveObj();
        toolList.push(newObj)
      }
    }

    if (event.type === 'Transient') {
      const newStyle = {
        ...transient,
        attrs:{
          ...transient.attrs,
          body:{
            fill:event.id === store.selection.focusid ? 'rgba(47, 190, 232, 1)' : 'rgba(47, 190, 232, 0.6)'
          }
        }
      }
      dataList.push({
        ...event,
        ...newStyle,
        label: event.name,
        tools: event.repeateditable || event.curveeditable ? toolList : []
        // tools: 'ToolRepeat'
      })
    } else if (event.type === 'Continuous') {
      const newStyle = {
        ...continues,
        attrs:{
          ...continues.attrs,
          body:{
            fill:event.id === store.selection.focusid ? 'rgba(244, 215, 92, 1)' : 'rgba(244, 215, 92, 0.6)'
          }
        }
      }
      dataList.push({
        ...event,
        ...newStyle,
        label: event.name,
        tools: !event.repeateditable || !event.curveeditabl ? toolList : []
      })
    } else if (event.type === 'group') {
      const newStyle = {
        ...group,
        attrs:{
          ...group.attrs,
          body:{
            fill:event.id === store.selection.focusid ? 'rgba(241, 148, 8, 1)' : 'rgba(241, 148, 8, 0.6)'
          }
        }
      }
      dataList.push({
        ...event,
        ...newStyle,
        label: event.name,
        tools: event.repeateditable || event.curveeditabl ? toolList : []
      })
    } else if (event.type === 'AtoV') {
      const newStyle = {
        ...AtoV,
        attrs:{
          ...AtoV.attrs,
          body:{
            fill:event.id === store.selection.focusid ? 'rgba(158, 193, 227, 1)' : 'rgba(158, 193, 227, 0.6)'
          }
        }
      }
      dataList.push({
        ...event,
        ...newStyle,
        label: event.name,
        tools: event.repeateditable || event.curveeditabl ? toolList : []
      })
    }
  }
  return dataList;
}

const ProjectDeal = (flowChart) => {
  const tab = store.currentTab;
  const projects = store.projects;
  const dataList: Array<any> = [];
  if (tab) {
    if (projects.has(tab.rootid)) {
      projects.get(tab.rootid)!.groups.forEach((event, key) => {
        const toolList: Array<any> = new Array<any>();
        if (event.repeateditable) {
          const newObj = onRepeatObj();
          toolList.push(newObj)
        }
        const newStyle = {
          ...group,
          attrs:{
            ...group.attrs,
            body:{
              fill:event.id === store.selection.focusid ? 'rgba(241, 148, 8, 1)' : 'rgba(241, 148, 8, 0.6)'
            }
          }
        }
        dataList.push({
          ...newStyle,
          // ...event,
          id: event.id,
          name: event.name,
          label: event.name,
          relativeTime: event.start,
          repeateditable: event.repeateditable,
          repeat: event.repeat,
          tools: event.repeateditable ? toolList : []
        })
      });
      projects.get(tab.rootid)!.events.forEach((event) => {
        const data = ProcessData(dataList, event);
        dataList.concat(data);
      });
      projects.get(tab.rootid)!.a2vs.forEach((event, key) => {
        const newStyle = {
          ...AtoV,
          attrs:{
            ...AtoV.attrs,
            body:{
              fill:event.id === store.selection.focusid ? 'rgba(158, 193, 227, 1)' : 'rgba(158, 193, 227, 0.6)'
            }
          }
        }
        dataList.push({
          ...newStyle,
          id: event.id,
          name: event.name,
          label: event.name,
          relativeTime: event.start
        })
      });
    }
  }
  const sortDataList = sortEvents(dataList);
  return sortDataList;
};

const GroupDeal = (flowChart) => {
  const tab = store.currentTab;
  const dataList: Array<any> = [];
  const project = store.current;
  if (project && project.groups.has(tab!.contentid)) {
    const events = project.groups.get(tab!.contentid)!.events;
    if (events) {
      events.forEach((event) => {
        const data = ProcessData(dataList, event);
        dataList.concat(data);
      });
    }
  }
  const sortDataList = sortEvents(dataList);
  return sortDataList;
}

const AtoVDeal = (flowChart) => {
  const tab = store.currentTab;
  const dataList: Array<any> = [];
  const project = store.current;
  if(project && project.a2vs.has(tab!.contentid)) {
    const events = project.a2vs.get(tab!.contentid)!.events;
    if(events) {
      events.forEach((event) => {
        const data = ProcessData(dataList, event);
        dataList.concat(data);
      });
    }
  }
  const sortDataList = sortEvents(dataList);
  return sortDataList;
}

//event排序
const sortEvents = (dataList => {
  let newData = dataList.sort((a: any, b: any) => (a.relativeTime > b.relativeTime ? 1 : a.relativeTime === b.relativeTime ? 0 : -1))
    .map((item, index) => {
      const x = index % 5 + 1;
      const y = (index + 1) / 5;
      return ({
        ...item,
        x: x * 150,
        y: Math.ceil(y) * 100
      })
    });
  for (var i = 0; i < newData.length - 1; i++) {
    if (newData[i].x < newData[i + 1].x) {
      newData.push({
        id: randomUuid(),
        source: {
          cell: newData[i].id,
          port: 'right'
        },
        target: {
          cell: newData[i + 1].id,
          port: 'left'
        },
        ...edgeObj
      })
    } else if (newData[i + 1].x == newData[0].x) {
      newData.push({
        id: randomUuid(),
        source: {
          cell: newData[i].id,
          port: 'right'
        },
        target: {
          cell: newData[i + 1].id,
          port: 'left'
        },
        ...getEdgeTurnObj(newData[i].x + 150, newData[i].y + 80, newData[i + 1].x - 50, newData[i + 1].y - 20)
      })
    }
  }
  return newData;
})

export { X6DataFormart }