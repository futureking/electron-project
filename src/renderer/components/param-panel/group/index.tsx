import React from 'react';
import { Typography } from 'antd';

import gstyles from '../index.less';
import { observer } from 'mobx-react-lite';
import store from '@/stores';
import TimeFormat from '@/components/time-format';
import InputFormat from '@/components/input-format';
import { TimeType } from '@/models';
import { calcEnabledMaxTForPkg, calcEnabledMinTForPkg, calcNextBeginInPkg, calcNextBeginInRoot } from '@/cmd';
import { isNull, isUndefined } from 'lodash';
import { transientDuration } from '@/utils/he-utils';
import ProjectParam from '../project';

const { Paragraph } = Typography;

const GroupParam = observer(() => {
  const g = store.focusGroup;
  const tab = store.currentTab;
  const changeTime = (value: number | string | null | undefined, type: TimeType) => {
    if (isNull(value) || isUndefined(value) || value === '' || isUndefined(g))
      return;

    let v = typeof (value) === 'number' ? value : parseInt(value, 10);
    let min = g.timeAtMin ?? 0;
    let sec = g.timeAtSec ?? 0;
    let msec = g.timeAtMSec ?? 0;
    let newValue: number;
    switch (type) {
      case TimeType.Min:
        newValue = v * 60000 + sec * 1000 + msec;
        break;
      case TimeType.Sec:
        newValue = min * 60000 + v * 1000 + msec;
        break;
      case TimeType.MSec:
        newValue = min * 60000 + sec * 1000 + v;
        break;
      default:
        newValue = g!.start;
    }
    const minT = calcEnabledMinTForPkg(g.start);
    const maxT = calcEnabledMaxTForPkg(g.endWithRepeat!);
    const d = g.durationWithRepeat;
    console.log('change time', minT, maxT - d);
    if (newValue < minT)
      newValue = minT;
    if (newValue > maxT - d)
      newValue = maxT - d;

    g!.setStart(newValue);
    if (store.selection.indType === "Pointer") {
      store.selector.setStart(newValue);
      store.selector.setEnd(newValue + g.durationWithRepeat);
    }
  }

  const changeFreq = (v: number) => {
    const value = v < 0 ? 0 : (v > 100 ? 100 : v);
    if (isUndefined(tab) || isUndefined(g))
      return;
    const originEnd = g.endWithRepeat;
    const nextBegin = calcNextBeginInRoot(originEnd!);

    const ratio = value / g.maxRatio;

    g.events.forEach((event, key) => {
      if (g.frequencyRatio.has(key) && event.relativeTime !== null) {
        const newValue = Math.round(ratio * g.frequencyRatio.get(key)!);
        if (event.isTransient) {
          const newDuration = transientDuration(newValue);
          const delta = (newDuration - event.duration) * event.repeat.times;
          console.log(`event orgin duration = ${event.duration}, new duration = ${newDuration}, delta = ${delta}`);
          if (event.endWithRepeat !== g.duration) {
            const newEventBegin = calcNextBeginInPkg(g, event.endWithRepeat!);
            const eventspace = newEventBegin - event.endWithRepeat!;
            console.log(`next event time = ${newEventBegin}, event space = ${eventspace}`);
            const eventmove = delta - eventspace;
            console.log('event move', eventmove);

            if (eventmove > 0) {
              g!.makesureLegal(event.end! + g.start, eventmove);
            }
          }
          else {
            const eventspace = nextBegin - originEnd;
            console.log(`next event time = ${nextBegin}, event space = ${eventspace}`);
            const eventmove = delta - eventspace;
            console.log('event move', eventmove);
            if (eventmove > 0) {
              g!.makesureLegal(event.end! + g.start, eventmove);
            }
          }
        }
        event.setFrequency(newValue);
      }
    });
    if (tab.type === 'Root') {
      const project = store.current;
      const currentEnd = g.endWithRepeat;
      const delte = currentEnd - originEnd;
      const space = nextBegin - originEnd;
      const move = delte - space;
      console.log(`group delte = ${delte}, space = ${space}, move = ${move}`);
      if (!isUndefined(project) && move > 0) {
        project!.makesureLegal(g.start, move, g.id);
      }
    }
  }
  return (
    !isUndefined(g) ?
      <>
        <div className={gstyles.title}>GROUP</div>
        <div className={gstyles.name}>Name</div>
        <Paragraph 
          editable={{ maxLength: 20 ,onChange: (value) => { g.setName(value); tab!.updateSubName(value); } }} 
          className={gstyles.context}
        >
          {g.name}
        </Paragraph>
        <div className={gstyles.name}>Type</div>
        <div className={gstyles.context}>Group</div>
        <div className={gstyles.name}>Event Amount</div>
        <div className={gstyles.context}>{g!.count}</div>
        <div className={gstyles.name}>Start Time</div>
        <TimeFormat min={g!.timeAtMin} sec={g.timeAtSec} msec={g.timeAtMSec} disabled={false} change={changeTime} />
        <div className={gstyles.name}>Duration</div>
        <div className={gstyles.context}>{g.duration}</div>
        <div className={gstyles.name}>Intensity</div>
        <InputFormat min={0} max={100} value={g.maxIntensity} disabled={false} change={g.setTotalIntensity} />
        <div className={gstyles.name}>Frequency</div>
        <InputFormat min={0} max={100} value={g.maxFrequency} disabled={false} change={changeFreq} />
      </>
      : <ProjectParam />
  );
});

export default GroupParam;