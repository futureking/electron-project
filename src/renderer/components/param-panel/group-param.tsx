import React from 'react';
import { InputNumber, Slider, Typography } from 'antd';
import { TimeType } from '../../models';
import styles from './group-param.less';
import gstyles from './param-panel.less';
import store from '@/stores';
import { observer } from 'mobx-react-lite';

const { Paragraph } = Typography;

interface GroupProps {
  // name: string;
  // array: Array<string>;
}

const GroupParam = observer((props: GroupProps) => {
  const g = store.projectStore.projects.get(store.selection.pid)!.groups.get(store.selection.gid)

  const changeTime =  (value: number | string | null | undefined, type: TimeType) => {
    if (value === null || typeof(value) === 'undefined')
      return
    let v = typeof value === 'string' ? parseInt(value, 10) : value
    let min = g!.timeAtMin ?? 0;
    let sec = g!.timeAtSec ?? 0;
    let msec = g!.timeAtMSec ?? 0;
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
    if (newValue < 0)
      newValue = 0;

    g!.setStart(newValue);
  }

  return (
    <>
      <div className={gstyles.title}>GROUP</div>
      <ul>
        <li>
          <div className={gstyles.name}>Name:</div>
          <Paragraph
            editable={{ onChange: g?.setName }}
            style={{ fontSize: 12, marginBottom: 0 }}
          >
            {g?.name}
          </Paragraph>
        </li>
        <li>
          <div className={gstyles.name}>Type:</div>
          <div style={{ fontSize: 12 }}>Group</div>
        </li>
        <li>
          <div className={gstyles.name}>Event Amount:</div>
          <div style={{ fontSize: 12 }}>{g?.count}</div>
        </li>
        <li>
          <div className={gstyles.name}>Start Time:</div>
        </li>
        <li>
          <InputNumber
            value={g?.timeAtMin}
            className={styles.time}
            onChange={value => changeTime(value, TimeType.Min)}
          />
          <InputNumber
            value={g?.timeAtSec}
            className={styles.time}
            onChange={value => changeTime(value, TimeType.Sec)}
          />
          <InputNumber
            value={g?.timeAtMSec}
            className={styles.time}
            onChange={value => changeTime(value, TimeType.MSec)}
          />
        </li>
        <li>
          <div className={gstyles.name}>Duration:</div>
          <div style={{ fontSize: 12 }}>{g?.duration}</div>
        </li>
        <li>
          <div className={gstyles.name}>Intensity:</div>
        </li>
        <li>
          <Slider
            min={0}
            max={100}
            className={styles.slider}
            defaultValue={g!.maxIntensity}
            onChange={(value: number) => console.log(value)}
          />
          <InputNumber
            min={0}
            max={100}
            className={styles.input}
            value={g!.maxIntensity}
          />
        </li>
        <li>
          <div className={gstyles.name}>Frequency:</div>
        </li>
        <li>
          <Slider
            // min={0}
            // max={100}
            className={styles.slider}
            defaultValue={g!.maxFrequency}
            onChange={(value: number) => console.log(value)}
          />
          <InputNumber
            min={0}
            max={100}
            className={styles.input}
            value={g!.maxFrequency}
          />
        </li>
      </ul>
    </>
  );
});

export default GroupParam;
