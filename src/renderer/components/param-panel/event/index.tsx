import React from 'react';
import { Typography } from 'antd';

import gstyles from '../index.less';
import { observer } from 'mobx-react-lite';
import store from '@/stores';
import { TimeType } from '@/models';
import TimeFormat from '@/components/time-format';
import InputFormat from '@/components/input-format';
import { calcEnabledMaxTForEvent, calcEnabledMinTForEvent } from '@/cmd';
import { isNull, isUndefined } from 'lodash';
import { transientDuration } from '@/utils/he-utils';
import ProjectParam from '../project';

const { Paragraph } = Typography;

const EventParam = observer(() => {
  const event = store.focusEvent;

  const changeRelative = (value: number | string | null | undefined, type: TimeType) => {
    if (value === null || typeof (value) === 'undefined' || value === '' || isUndefined(event) || isNull(event.relativeTime))
      return;

    let v = typeof value === 'number' ? value : parseInt(value, 10);
    let min = event.relativeTimeAtMin ?? 0;
    let sec = event.relativeTimeAtSec ?? 0;
    let msec = event.relativeTimeAtMSec ?? 0;
    let newValue;
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
        newValue = event.relativeTime ?? 0;
    }
    const minT = calcEnabledMinTForEvent(event.relativeTime!);
    const maxT = calcEnabledMaxTForEvent(event.endWithRepeat!);
    const d = event.durationWithRepeat;
    console.log('change time', minT, maxT - d);
    if (newValue < minT)
      newValue = minT;
    if (newValue > maxT - d)
      newValue = maxT - d;
    event!.setRelativeTime(newValue);
    if (store.selection.indType === "Pointer") {
      store.selector.setStart(newValue);
      store.selector.setEnd(newValue + event.durationWithRepeat);
    }
  }

  const changeDuration = (v) => {
    if (isUndefined(event) || event.type !== 'Continuous')
      return;
    let minD = event.curve.length - 1;
    let maxD = 5000;
    if (!isNull(event.relativeTime)) {
      const totalMax = calcEnabledMaxTForEvent(event!.endWithRepeat!) - event.relativeTime;
      maxD = Math.floor((totalMax - event.repeat.interval * (event.repeat.times - 1)) / event.repeat.times);
      maxD = Math.min(maxD, 5000);
    }
    console.log('maxD: ', maxD);
    let newValue = v;
    if (newValue < minD)
      newValue = minD;
    if (newValue > maxD)
      newValue = maxD;
    event!.setDuration(newValue);
    if (store.selection.indType === "Pointer")
      store.selector.setEnd(newValue);
  }
  const changIntensity = (v) => {
    const tab = store.currentTab;
    if (isUndefined(tab) || isUndefined(event)) return;
    let value = v < 0 ? 0 : (v > 100 ? 100 : v);
    event.setIntensity(value);
    if (tab.type === 'Group')
      store.currentGroup!.updateIntensityRatio(event!.id, value);
    else if (tab.type === 'A2V')
      store.currentA2V!.updateIntensityRatio(event!.id, value);
  }
  const changFrequency = (v) => {
    let value = v < 0 ? 0 : (v > 100 ? 100 : v);
    const tab = store.currentTab;
    if (isUndefined(tab) || isUndefined(event))
      return;
    const delta = (transientDuration(value) - event.duration) * event.repeat.times;
    const space = calcEnabledMaxTForEvent(event.endWithRepeat!) - event.endWithRepeat!;
    const move = delta - space;
    if (move > 0) {
      switch (tab.type) {
        case 'Root':
          const project = store.current;
          if (!isUndefined(project)) {
            project!.makesureLegal(event.endWithRepeat!, move);
          }
          break;
        case 'Group':
          const group = store.currentGroup;
          if (!isUndefined(group)) {
            group!.makesureLegal(event.endWithRepeat + group.start!, move);
          }
          break;
        case 'A2V':
          const a2v = store.currentA2V;
          if (!isUndefined(a2v)) {
            a2v!.makesureLegal(event.endWithRepeat! + a2v!.start, move);
          }
          break;
      }
    }
    event.setFrequency(value);
  }
  return (
    !isUndefined(event) ?
      <>
        <div className={gstyles.title}>{event!.type.toUpperCase()}</div>
        <div className={gstyles.name}>Name</div>
        <Paragraph 
          editable={{ maxLength: 20, onChange: event!.setName }} 
          className={gstyles.context}
        >
          {event!.name}
        </Paragraph>
        <div className={gstyles.name}>Type</div>
        <div className={gstyles.context}>{event!.type}</div>
        <div className={gstyles.name}>Start Time</div>
        <TimeFormat min={event!.relativeTimeAtMin} sec={event!.relativeTimeAtSec} msec={event!.relativeTimeAtMSec} disabled={event!.relativeTime === null} change={changeRelative} />
        <div className={gstyles.name}>Duration</div>
        <InputFormat min={3} max={5000} value={event!.duration} disabled={event!.type === 'Transient'} change={changeDuration} />
        <div className={gstyles.name}>Intensity</div>
        <InputFormat min={0} max={100} value={event!.intensity} disabled={false} change={changIntensity} />
        <div className={gstyles.name}>Frequency</div>
        <InputFormat min={0} max={100} value={event!.frequency} disabled={false} change={changFrequency} />
      </>
      : <ProjectParam />
  );
});

export default EventParam;