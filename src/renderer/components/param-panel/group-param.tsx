import React, { useState } from 'react';
import { InputNumber, Slider, Typography } from 'antd';
import { ProjectType, TimeType } from '../../models';
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
  console.log('group', g?.count)
  const changeTime = (value: number, type: TimeType) => {
    let min = g!.timeAtMin ?? 0;
    let sec = g!.timeAtSec ?? 0;
    let msec = g!.timeAtMSec ?? 0;
    let newValue: number;
    switch (type) {
      case TimeType.Min:
        newValue = value * 60000 + sec * 1000 + msec;
        break;
      case TimeType.Sec:
        newValue = min * 60000 + value * 1000 + msec;
        break;
      case TimeType.MSec:
        newValue = min * 60000 + sec * 1000 + value;
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
            onChange={(e) => changeTime(e, TimeType.Min)}
          />
          <InputNumber
            value={g?.timeAtSec}
            className={styles.time}
            onChange={(e) => changeTime(e, TimeType.Sec)}
          />
          <InputNumber
            value={g?.timeAtMSec}
            className={styles.time}
            onChange={(e) => changeTime(e, TimeType.MSec)}
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
            onChange={(value: number)=>console.log(value)}
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
            onChange={(value: number)=>console.log(value)}
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
