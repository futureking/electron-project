import { observer } from "mobx-react-lite";
import style from './haptics-track.less';
import store from '@/stores';
import { timeToX, intensToY, intensToH, timeToWidth } from "@/utils/draw-utils";
import React, { Fragment } from 'react';
import { keys, values } from "mobx";

interface HapticsTrackProps {
  ppms: number;
  factor: number;
  total: number;
  height: number;
}

interface EventProps {
  pid: string;
  ppms: number;
  factor: number;
  height: number;
  id: string;
  time: number;
  intensity: number;
  duration: number;
  frequency: number;
}

const TransientEvent = observer((props: EventProps) => {
  const {id, pid, time, intensity, frequency, duration, ppms, factor, height} = props;

  return (
    <g id={id} key={id} type='event' onMouseDown={()=>store.selection.setSelection('Event', pid, id)}>
      <rect
        x={timeToX(time, ppms, factor)}
        y={intensToY(intensity, height)}
        width={timeToWidth(duration, ppms, factor)}
        height={intensToH(intensity, height)}
        rx={4} ry={4}
        fill='#2FB3DA'
        stroke='black'
        strokeWidth={1}
        opacity={frequency/100}
      />
    </g>
  );
});

const ContinuousEvent = observer((props: EventProps) => {
  const {id, pid, time, intensity, frequency, duration, ppms, factor, height} = props;

  const path = (e:any, height:number) => {
    let p = 'M'+ timeToX(e.relativeTime, ppms, factor) + ' ' + intensToY(0, height);
    for (let i = 1; i < e.ponitCount; i++) {
      p += ' L' + timeToX(e.relativeTime + e.curve[i].time, ppms, factor) + ' ' + intensToY(e.intensity*e.curve[i].intensity, height);
    }
    p+=' Z'
    return p;
  }

  return (
    <g id={id} onMouseDown={()=>store.selection.setSelection('Event', pid, id)}>
      <rect
        x={timeToX(time, ppms, factor)}
        y={intensToY(intensity, height)}
        width={timeToWidth(duration, ppms, factor)}
        height={intensToH(intensity, height)}
        rx={4} ry={4}
        fill='#716C2A'
      />
      <path d={path(store.projectStore.projects.get(pid)!.events.get(id), height)} fill={'url(#' + id + '-gradient)'} stroke='black' strokeWidth={1} />
      <defs>
        <linearGradient id={id + '-linear'}
          x={timeToX(time, ppms, factor)}
          y={intensToY(intensity, height)}
          width={timeToWidth(duration, ppms, factor)}
          height={intensToH(store.projectStore.projects.get(pid)!.events.get(id)!.maxIntensity, height)}
        >
          {
            store.projectStore.projects.get(pid)?.events.get(id)!.curve!.map((v, i) => {
              return (
                <stop key={id + '-' + i} offset={v.time / duration} stopColor="#F4E23C" stopOpacity={(v.frequency + frequency) / 100} />
              )
            })
          }
        </linearGradient>
      </defs>
    </g>

  );
});

interface GroupProps {
  id: string;
  pid: string;
  ppms: number;
  factor: number;
  height: number;
}

const Group = observer((props: GroupProps) => {
  const { id, pid, ppms, factor, height} = props;
  const g = store.projectStore.projects.get(pid)!.groups.get(id)
  const x = timeToX(g!.start, ppms, factor)
  const y = intensToY(g!.maxIntensity, height)
  const w = timeToWidth(g!.duration, ppms, factor)
  const h = intensToH(g!.maxIntensity, height)
  return (
    <g id={id} key={id} type='event' onMouseDown={()=>store.selection.setSelection('Group', pid, id)}>
      <rect
        x={x} y={y} width={w} height={h}
        rx={4} ry={4}
        fillOpacity={0}
        stroke='#FBC04D'
        strokeWidth={1}
      />
      <text x={x+w-10} y = {y+10}style={{ fontSize: 10, fill: '#FBC04D', textAnchor: 'end', userSelect:"none", pointerEvents:'none'}}>{g!.name}</text>
    </g>
  );
});


const HapticsTrack = observer((props: HapticsTrackProps) => {
  const {ppms, factor, total, height} = props;
  const pid = store.selection.pid
  const elemsE :Array<any> = [];
  const elemsG :Array<any> = [];
  store.projectStore.projects.get(pid)?.events.forEach((value, key) => {
    if (value.relativeTime !== null && value.relativeTime != undefined) {
      elemsE.push(
          value.type === 'Transient' ?
          <TransientEvent key={key} id={key} pid={pid} time={value.relativeTime} intensity={value.intensity} frequency={value.frequency} duration={value.eventDuration} ppms={ppms} factor={factor} height={height}/> :
          <ContinuousEvent key={key} id={key} pid={pid} time={value.relativeTime} intensity={value.intensity} frequency={value.frequency} duration={value.eventDuration} ppms={ppms} factor={factor} height={height}/>
      )
    }
  });
  store.projectStore.projects.get(pid)?.groups.forEach((value, key) => {
    elemsG.push(<Group key={key} id={key} pid={pid} ppms={ppms} factor={factor} height={height}/>)
  })

  return (
    <svg className={style.haptics} width={total * ppms * factor} height={height}>
      {elemsE}
      {elemsG}
    </svg>
  );
});

export {HapticsTrack}
