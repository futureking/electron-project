import { TimeType } from '@/models';
import store from '@/stores';
import { InputNumber } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';

import style from './selector-tool.less';

const SelectorTool = observer(() => {
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

    if (newValue > store.selector.end)
      store.selector.setEnd(newValue);
    store.selector.setStart(newValue);
  }

  const changeEnd = (value: number | string | null | undefined, type: TimeType) => {
    if (value === null || typeof (value) === 'undefined')
      return
    let v = typeof value === 'string' ? parseInt(value, 10) : value
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

    if (newValue < store.selector.start)
      store.selector.setStart(newValue);
    store.selector.setEnd(newValue);
  }

  return (
    <div className={style.selector}>
      <label>Start Time:</label>
      <InputNumber
        className={style.input}
        value={store.selector.startAtMin}
        onChange={value => changeStart(value, TimeType.Min)}
      />
      <InputNumber
        className={style.input}
        value={store.selector.startAtSec}
        onChange={value => changeStart(value, TimeType.Sec)}
      />
      <InputNumber
        className={style.input}
        value={store.selector.startAtMSec}
        onChange={value => changeStart(value, TimeType.MSec)}
      />
      <label>End Time:</label>
      <InputNumber
        className={style.input}
        value={store.selector.endAtMin}
        onChange={value => changeEnd(value, TimeType.Min)}
      />
      <InputNumber
        className={style.input}
        value={store.selector.endAtSec}
        onChange={value => changeEnd(value, TimeType.Sec)}
      />
      <InputNumber
        className={style.input}
        value={store.selector.endAtMSec}
        onChange={value => changeEnd(value, TimeType.MSec)}
      />
      <label>Duartion:</label>
      <div style={{ paddingLeft: 16 }}>{store.selector.duration}</div>
    </div>
  );
});

export default SelectorTool;
