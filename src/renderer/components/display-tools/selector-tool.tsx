import { TimeType } from '@/models';
import store from '@/stores';
import { InputNumber, Row } from 'antd';
import { observer } from 'mobx-react-lite';
import React from 'react';

import style from './selector-tool.less';


const SelectorTool = observer(() => {
  const changeStart = (value: number, type: TimeType) => {
    let min = store.selector.startAtMin;
    let sec = store.selector.startAtSec;
    let msec = store.selector.startAtMSec;
    let newValue;
    switch (type) {
      case TimeType.Min:
        newValue = value*60000+sec*1000+msec;
        break;
      case TimeType.Sec:
        newValue = min*60000+value*1000+msec;
        break;
      case TimeType.MSec:
        newValue = min*60000+sec*1000+value;
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
  const changeEnd = (value: number, type: TimeType) => {
    let min = store.selector.endAtMin;
    let sec = store.selector.endAtSec;
    let msec = store.selector.endAtMSec;
    let newValue;
    switch (type) {
      case TimeType.Min:
        newValue = value*60000+sec*1000+msec;
        break;
      case TimeType.Sec:
        newValue = min*60000+value*1000+msec;
        break;
      case TimeType.MSec:
        newValue = min*60000+sec*1000+value;
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
          onChange={v=>changeStart(v, TimeType.Min)}
        />
        <InputNumber
          className={style.input}
          value={store.selector.startAtSec}
          onChange={v=>changeStart(v, TimeType.Sec)}
        />
        <InputNumber
          className={style.input}
          value={store.selector.startAtMSec}
          onChange={v=>changeStart(v, TimeType.MSec)}
        />
        <label>End Time:</label>
        <InputNumber
          className={style.input}
          value={store.selector.endAtMin}
          onChange={v=>changeEnd(v, TimeType.Min)}
        />
        <InputNumber
          className={style.input}
          value={store.selector.endAtSec}
          onChange={v=>changeEnd(v, TimeType.Sec)}
        />
        <InputNumber
          className={style.input}
          value={store.selector.endAtMSec}
          onChange={v=>changeEnd(v, TimeType.MSec)}
        />
        <label>Duartion:</label>
        <div className={style.input}>{store.selector.duration}</div>
        {/* <InputNumber className={style.input} value={} disabled={true}/> */}
    </div>
  );
});

export default SelectorTool;
