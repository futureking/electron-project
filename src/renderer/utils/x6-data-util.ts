import store from "@/stores";
import { randomUuid } from '@/utils/utils';

enum EventType {
  Transient = 'Transient',
  Continuous = 'Continuous',
  Group = 'Group'
}

const eventFormart = (type) => {
  let bgColor:string = ""; 
  switch(type) {
    case (EventType.Transient):
      bgColor = '#36AFD2';
      break;
    case (EventType.Continuous):
      bgColor = '#D5C854';
      break;
    case (EventType.Group):
      bgColor = '#F4B53A';
      break;
    default:
      break;
  }
  const nodeObj = {
    x: 0,
    y: 40,
    width: 80,
    height: 40,
    shape: "rect",
    label: type,
    attrs: {
      body: {
        fill: bgColor,
        rx: "4px",
        ry: "4px"
      },
      label: {
        size: 10
      }
    },
    ports: {
      groups: {
        left: {
          position: 'left',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
            },
          },
        },
        right: {
          position: 'right',
          attrs: {
            circle: {
              r: 4,
              magnet: true,
            },
          },
        }
      },
      items: [
        {
          group: 'left',
        },
        {
          group: 'right',
        }
      ],
    },
  };
  return nodeObj;
}

const edgeObj= {
  shape: "edge",
  attrs: {
    line: {
      stroke: '#5F95FF',
      strokeWidth: 1,
      targetMarker: {
        name: 'block',
        size: 6,
      },
    },
  },
  connector: { name: 'smooth' },
  zIndex: 111,
}

const X6DataFormart = () => {
  const pid = store.selection.pid;
  const projects = store.projectStore.projects;
  const dataList :Array<any> = [];
  projects.get(pid)?.groups.forEach((value, key) => {

  });
  projects.get(pid)?.events.forEach((value, key) => {
    if (value.relativeTime !== null && value.relativeTime != undefined) {
      if(value.type === 'Transient'){
        const TransientObj = eventFormart('Transient');
        dataList.push({
          ...value,
          ...TransientObj
        })
      }else if( value.type === 'Continuous'){
        const ContinuousObj = eventFormart('Continuous');
        dataList.push({
          ...value,
          ...ContinuousObj
        })
      }
    }
  })
  const sortDataList = sortEvents(dataList);
  return sortDataList;
};

//event排序
const sortEvents = (dataList => {
  let newData = dataList.sort((a: any, b: any) => (a.relativeTime > b.relativeTime ? 1 : a.relativeTime === b.relativeTime ? 0 : -1 ))
                   .map((item, index) =>{
                    return ({
                      ...item,
                      x: (index + 1)*150 +100
                    })
                   });
  for(var i = 0; i< newData.length-1; i++) {
    if( newData[i].x < newData[i+1].x ) {
      newData.push({
        id: randomUuid(),
        source: newData[i].id,
        target: newData[i+1].id,
        ...edgeObj
      })
    }
  }
  return newData;
})

export { X6DataFormart }