import { TimeType } from '@/models';
import store from '@/stores';
import { observer } from 'mobx-react-lite';
import React from 'react';
import TimeFormat from '../time-format';

import style from './index.less';
interface SelectorToolProps {
  total: number;
}

const SelectorTool = observer((props: SelectorToolProps) => {
  const { total } = props;
  const changeStart = (value: number | string | null | undefined, type: TimeType) => {
    if (value === null || typeof (value) === 'undefined')
      return
    let v = typeof value === 'string' ? parseInt(value, 10) : value
    let min = store.selector.startAtMin;
    let sec = store.selector.startAtSec;
    let msec = store.selector.startAtMSec;
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
        newValue = store.selector.start;
    }
    if (newValue < 0)
      newValue = 0;
    else if (newValue > total)
      newValue = total

    if (newValue > store.selector.end)
      store.selector.setEnd(newValue);
    store.selector.setStart(newValue);
  }

  const changeEnd = (value: number | string | null | undefined, type: TimeType) => {
    if (value === null || typeof (value) === 'undefined' || value === '')
      return

    let v = typeof value === 'number' ? value : parseInt(value, 10);
    let min = store.selector.endAtMin;
    let sec = store.selector.endAtSec;
    let msec = store.selector.endAtMSec;
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
        newValue = store.selector.start;
    }
    if (newValue < 0)
      newValue = 0;
    else if (newValue > total)
      newValue = total

    if (newValue < store.selector.start)
      store.selector.setStart(newValue);
    store.selector.setEnd(newValue);
  }

  return (
    <div className={style.selector}>
      <div className={style.part}>
        <label>Start Time:</label>
        <TimeFormat min={store.selector.startAtMin} sec={store.selector.startAtSec} msec={store.selector.startAtMSec} disabled={store.selection.indType !== 'Time'} change={changeStart} />
      </div>
      <div className={style.part}>
        <label>End Time:</label>
        <TimeFormat min={store.selector.endAtMin} sec={store.selector.endAtSec} msec={store.selector.endAtMSec} disabled={true} change={changeEnd} />
      </div>
      <div className={style.part}>
        <label>Duartion:</label>
        <div className={style.duration}>{store.selector.duration}</div>
      </div>
    </div>
  );
});

export default SelectorTool;
