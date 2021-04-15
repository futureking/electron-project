import React, { useState } from 'react';
import { Col, Divider, InputNumber, Row, Slider, Typography } from 'antd';
import { EventType } from '../../models/richtap';

import styles from './event-param.less';
import gstyles from './param-panel.less';
import { observer } from 'mobx-react-lite';
import store from '@/stores';
import { TimeType } from '@/models';

const { Paragraph } = Typography;


const EventParam = observer(() => {
  const pid = store.selection.pid
  const id = store.selection.eid

  const event = store.projectStore.projects.get(pid)!.events.get(id)

  const changeRelative = (value: number, type: TimeType) => {
    let min = event!.relativeTimeAtMin ?? 0;
    let sec = event!.relativeTimeAtSec ?? 0;
    let msec = event!.relativeTimeAtMSec ?? 0;
    let newValue;
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
        newValue = event!.relativeTime ?? 0;
    }
    if (newValue < 0)
      newValue = 0;

    event!.setRelativeTime(newValue);

  }
  return (
    <>
      <div className={gstyles.title}>{event?.type}</div>
      <ul>
        <li>
          <div className={gstyles.name}>Name:</div>
          <Paragraph
            editable={{ onChange: event?.setName }}
            style={{ fontSize: 12, marginBottom: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {event?.name}
          </Paragraph>
        </li>
        <li>
          <div className={gstyles.name}>Type:</div>
          <div style={{ fontSize: 12 }}>{event?.type}</div>
        </li>
        <li>
          <div className={gstyles.name}>Start Time:</div>
        </li>
        <li>
          <InputNumber
            value={event?.relativeTimeAtMin}
            className={styles.time}
            onChange={(e) => changeRelative(e, TimeType.Min)}
          />
          <InputNumber
            value={event?.relativeTimeAtSec}
            className={styles.time}
            onChange={(e) => changeRelative(e, TimeType.Sec)}
          />
          <InputNumber
            value={event?.relativeTimeAtMSec}
            className={styles.time}
            onChange={(e) => changeRelative(e, TimeType.MSec)}
          />
        </li>
        <li>
          <div className={gstyles.name}>Duration:</div>
        </li>
        <li>
          <Slider
            min={3}
            max={5000}
            value={event?.eventDuration}
            className={styles.slider}
            disabled={event?.type === 'Transient'}
            onChange={event?.setDuration}
          />
          <InputNumber
            min={3}
            max={5000}
            className={styles.input}
            value={event?.eventDuration}
            disabled={event?.type === 'Transient'}
            onChange={event?.setDuration}
          />
        </li>
        <li>
          <div className={gstyles.name}>Intensity:</div>
        </li>
        <li>
          <Slider
            min={0}
            max={100}
            className={styles.slider}
            value={event?.intensity}
            onChange={event?.setIntensity}
          />
          <InputNumber
            min={0}
            max={100}
            className={styles.input}
            value={event?.intensity}
            onChange={event?.setIntensity}
          />
        </li>
        <li>
          <div className={gstyles.name}>Frequency:</div>
        </li>
        <li>
          <Slider
            min={0}
            max={100}
            className={styles.slider}
            value={event?.frequency}
            onChange={event?.setFrequency}
          />
          <InputNumber
            min={0}
            max={100}
            className={styles.input}
            value={event?.frequency}
            onChange={event?.setFrequency}
          />
        </li>
      </ul>
    </>
  );
});

export default EventParam;
