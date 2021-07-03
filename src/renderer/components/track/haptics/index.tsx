import { observer } from "mobx-react-lite";
import style from './index.less';
import store from '@/stores';
import React from 'react';
import TransientEvent from "./transient";
import ContinuousEvent from "./continuous";
import Group from "./group";
import { IndicatorY, IndicatorX } from "./focus";
import { intensToH, intensToY, timeToWidth, timeToX, xToTime, yToIntens } from '@/utils/draw-utils';
import AudioVibration from "./a2v";
import { isNull, isUndefined } from "lodash";
import { calcEnabledMaxTForEvent, calcEnabledMaxTForPkg, calcEnabledMinTForEvent, calcEnabledMinTForPkg } from "@/cmd";
import { useUndoGroup } from "@/utils/groupUndo";

interface HapticsTrackProps {
  ppms: number;
  total: number;
  height: number;
  left: number;
  top: number;
  scroll: number;
}

const HapticsTrack = observer((props: HapticsTrackProps) => {
  const { ppms, total, height, left, top, scroll } = props;
  const elemsE: Array<any> = [];
  const elemsG: Array<any> = [];
  const elemsA: Array<any> = [];
  const tab = store.currentTab;
  const project = store.current;
  if (!isUndefined(tab)) {
    switch (tab.type) {
      case 'Root':
        if (!isUndefined(project)) {
          project.events.forEach((value, key) => {
            if (value.relativeTime !== null) {
              elemsE.push(
                value.type === 'Transient' ?
                  <TransientEvent key={key} id={key} ppms={ppms} height={height}
                    time={value.relativeTime} intensity={value.intensity} frequency={value.frequency} duration={value.duration}
                    repeat={value.repeat.times} interval={value.repeat.interval} showRepeatInd={true} /> :
                  <ContinuousEvent key={key} id={key} ppms={ppms} height={height}
                    time={value.relativeTime} intensity={value.intensity} frequency={value.frequency} duration={value.duration}
                    repeat={value.repeat.times} interval={value.repeat.interval}
                    curve={value.curve.toJSON()} showRepeatInd={true} />
              )
            }
          });
          project.groups.forEach((value, key) => {
            // if (value.count > 0)
            elemsG.push(<Group key={key} id={key} ppms={ppms} height={height} showGroupInd={true} />)
          });
          project.a2vs.forEach((value, key) => {
            // if (value.count > 0)
            elemsA.push(<AudioVibration key={key} id={key} ppms={ppms} height={height} showInd={true} />)
          })
        }
        break;
      case 'Group':
        const group = store.currentGroup;
        if (!!group) {
          group.events.forEach((value, key) => {
            if (value.relativeTime !== null) {
              elemsE.push(
                value.type === 'Transient' ?
                  <TransientEvent key={key} id={key} ppms={ppms} height={height}
                    time={value.relativeTime} intensity={value.intensity} frequency={value.frequency} duration={value.duration}
                    repeat={value.repeat.times} interval={value.repeat.interval} showRepeatInd={true} /> :
                  <ContinuousEvent key={key} id={key} ppms={ppms} height={height}
                    time={value.relativeTime} intensity={value.intensity} frequency={value.frequency} duration={value.duration}
                    repeat={value.repeat.times} interval={value.repeat.interval}
                    curve={value.curve.toJSON()} showRepeatInd={true} />
              )
            }
          });
        }
        break;
      case 'A2V':
        const a2v = store.currentA2V;
        if (!!a2v) {
          a2v.events.forEach((value, key) => {
            if (value.relativeTime !== null) {
              elemsE.push(
                value.type === 'Transient' ?
                  <TransientEvent key={key} id={key} ppms={ppms} height={height}
                    time={value.relativeTime} intensity={value.intensity} frequency={value.frequency} duration={value.duration}
                    repeat={value.repeat.times} interval={value.repeat.interval} showRepeatInd={true} /> :
                  <ContinuousEvent key={key} id={key} ppms={ppms} height={height}
                    time={value.relativeTime} intensity={value.intensity} frequency={value.frequency} duration={value.duration}
                    repeat={value.repeat.times} interval={value.repeat.interval}
                    curve={value.curve.toJSON()} showRepeatInd={true} />
              )
            }
          });
        }
    }
  }

  let showXInd = false, showYInd = false;
  let x: number = 0, y: number = 0, w: number = 0, h: number = 0;
  if (store.selection.indType === 'Pointer') {
    if (store.selection.focusType === 'Event') {
      const event = store.focusEvent;
      if (event && event.relativeTime !== null) {
        x = timeToX(event.relativeTime, ppms);
        y = intensToY(event.intensity, height, 32);
        w = timeToWidth(event.duration, ppms);
        h = intensToH(event.intensity, height, 32);
        showYInd = true;
        if (event.type === 'Continuous')
          showXInd = true;
      }
    }
    else if (store.selection.focusType === 'Group' && tab!.type === 'Root') {
      const group = store.focusGroup;
      if (group) {
        const intensity = group.maxIntensity;
        x = timeToX(group.start, ppms);
        y = intensToY(intensity, height, 32) - 16;
        w = timeToWidth(group.duration, ppms);
        h = intensToH(intensity, height, 32) - 16;
        showYInd = true;
      }
    }
    else if (store.selection.focusType === 'A2V' && tab!.type === 'Root') {
      const a2v = store.focusA2V;
      if (a2v) {
        const intensity = a2v.maxIntensity;
        x = timeToX(a2v.start, ppms);
        y = intensToY(intensity, height, 32) - 16;
        w = timeToWidth(a2v.duration, ppms);
        h = intensToH(intensity, height, 32) - 16;
        showYInd = true;
      }
    }
  }
  const onDown = (e: React.MouseEvent) => {
    if (store.selection.indType === 'Time') {
      let newX = e.clientX - store.selection.x - left + scroll;
      let newT = xToTime(newX, ppms);
      store.selector.setStart(newT);
      store.selector.setEnd(newT);
    }
  }

  const onMove = (event: React.MouseEvent) => {
    if (store.selection.indType !== 'Pointer' || store.selection.opType === 'None' || !(event.ctrlKey))
      return;
    switch (store.selection.opType) {
      case 'Intensity':
        let newY = event.clientY - top + store.selection.y;
        console.log(event.clientY, top, store.selection.y, newY);
        if (store.selection.focusType === 'Event') {
          const e = store.focusEvent;
          if (isUndefined(e)) return;
          let newIntensity = yToIntens(newY, height, 32);
          // console.log('new Intensity', newIntensity);
          newIntensity = newIntensity < 0 ? 0 : (newIntensity > 100 ? 100 : newIntensity);
          e.setIntensity(newIntensity);
        }
        else if (store.selection.focusType === 'Group') {
          const g = store.focusGroup;
          if (isUndefined(g)) return;
          let newIntensity = yToIntens(newY + 16, height, 32);
          newIntensity = newIntensity < 0 ? 0 : (newIntensity > 100 ? 100 : newIntensity);
          g.setTotalIntensity(newIntensity);
        }
        else if (store.selection.focusType === 'A2V') {
          const a2v = store.focusA2V;
          if (isUndefined(a2v)) return;
          let newIntensity = yToIntens(newY + 16, height, 32);
          newIntensity = newIntensity < 0 ? 0 : (newIntensity > 100 ? 100 : newIntensity);
          a2v.setTotalIntensity(newIntensity);
        }
        break;
      case 'Duration':
        if (store.selection.focusType === 'Event') {
          const e = store.focusEvent;
          if (isUndefined(e) || e.type !== 'Continuous' || isNull(e.relativeTime))
            return;
          let newX = event.clientX - store.selection.x - left + scroll;
          let newD = xToTime(newX, ppms) - e.relativeTime;
          let minD = e.curve.length - 1;
          let maxD = 5000;
          if (!isNull(e.relativeTime)) {
            const totalMax = calcEnabledMaxTForEvent(e!.endWithRepeat!) - e.relativeTime;
            maxD = Math.floor((totalMax - e.repeat.interval * (e.repeat.times - 1)) / e.repeat.times);
            maxD = Math.min(maxD, 5000);
          }
          // console.log('maxD: ', maxD);
          if (newD < minD)
            newD = minD;
          if (newD > maxD)
            newD = maxD;
          e.setDuration(newD);
        }
        break;
      case 'Position':
        let newX = event.clientX - store.selection.x - left + scroll;
        let newT = xToTime(newX, ppms);
        if (store.selection.focusType === 'Event') {
          const e = store.focusEvent;
          if (isUndefined(e) || isNull(e.relativeTime))
            return;
          const minT = calcEnabledMinTForEvent(e.relativeTime!);
          const maxT = calcEnabledMaxTForEvent(e.endWithRepeat!);
          const d = e.durationWithRepeat;
          // console.log('minT', minT, maxT - d, newT, d);
          if (newT < minT)
            newT = minT;
          if (newT > maxT - d)
            newT = maxT - d;
          e.setRelativeTime(newT);
        }
        else if (store.selection.focusType === 'Group') {
          const g = store.focusGroup;
          if (isUndefined(g) || isNull(g.start))
            return;
          const minT = calcEnabledMinTForPkg(g.start!);
          const maxT = calcEnabledMaxTForPkg(g.endWithRepeat!);
          const d = g.durationWithRepeat;
          // console.log('minT', minT, maxT - d, newT, d);
          if (newT < minT)
            newT = minT;
          if (newT > maxT - d)
            newT = maxT - d;
          g.setStart(newT);
        }
        else if (store.selection.focusType === 'A2V') {
          const a = store.focusA2V;
          if (isUndefined(a) || isNull(a.start))
            return;
          const minT = calcEnabledMinTForPkg(a.start!);
          const maxT = calcEnabledMaxTForPkg(a.endWithRepeat!);
          const d = a.durationWithRepeat;
          // console.log('minT', minT, maxT - d, newT, d);
          if (newT < minT)
            newT = minT;
          if (newT > maxT - d)
            newT = maxT - d;
          a.setStart(newT);
        }
        break;
    }
  }
  const timeInd = timeToX(store.selector.start, ppms);
  const moveChange = useUndoGroup(!isUndefined(tab) && tab.rootid, (event) => onMove(event));
  return (
    !isUndefined(tab) ?
      <svg className={style.haptics} width={total * ppms} height={height}
        onMouseMove={(event) => {
          if (event.ctrlKey) {
            moveChange.start(event);
          }
        }}
        onMouseLeave={(event) => {
          moveChange.stop();
        }}
        onMouseDown={(event) => {
          onDown(event);
        }}
        onMouseUp={(e) => {
          if (store.selection.opType !== 'None') {
            switch (store.selection.opType) {
              case 'Duration':
                const event = store.focusEvent;
                if (!isUndefined(event) && !isNull(event.relativeTime))
                  store.selector.setEnd(event.endWithRepeat!);
                break;
              case 'Position':
                switch (store.selection.focusType) {
                  case 'Event':
                    const event = store.focusEvent;
                    if (!isUndefined(event) && !isNull(event.relativeTime)) {
                      store.selector.setStart(event.relativeTime);
                      store.selector.setEnd(event.endWithRepeat!);
                    }
                    break;
                  case 'Group':
                    const group = store.focusGroup;
                    if (!isUndefined(group)) {
                      store.selector.setStart(group.start);
                      store.selector.setEnd(group.endWithRepeat);
                    }
                    break;
                  case 'A2V':
                    const a2v = store.focusA2V;
                    if (!isUndefined(a2v)) {
                      store.selector.setStart(a2v.start);
                      store.selector.setEnd(a2v.endWithRepeat);
                    }
                    break;
                }
            }
            store.selection.clearOP();
          }
          moveChange.stop();
        }}>
        <linearGradient id='bg' x1="0" x2="0" y1="0" y2="1">
          <stop offset={0} stopColor="rgba(220, 219, 219)" stopOpacity={0} />
          <stop offset={1} stopColor="rgba(220, 219, 219)" stopOpacity={0.2} />
        </linearGradient>
        <rect fill="url(#bg)" x={0} y={0} width={total * ppms} height={height} />
        {elemsE.length > 0 && elemsE}
        {elemsG.length > 0 && elemsG}
        {elemsA.length > 0 && elemsA}
        {showYInd && <IndicatorY x={x} y={y} w={w} h={h} />}
        {showXInd && <IndicatorX x={x} y={y} w={w} h={h} />}
        {store.selection.indType === 'Time' &&
          <>
            <polygon points={`${timeInd - 6},0 ${timeInd + 6},0 ${timeInd} 8`} fill='white' />
            <line x1={timeToX(store.selector.start, ppms)} y1={10} x2={timeToX(store.selector.start, ppms)} y2={height}
              stroke='white' strokeWidth={2} />
          </>
        }
      </svg>
      : <svg className={style.haptics} width={total * ppms} height={height} />
  );
});

export default HapticsTrack;
