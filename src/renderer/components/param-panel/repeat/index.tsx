import { Typography, InputNumber } from 'antd';
import gstyles from '../index.less';
import store from '@/stores';
import { observer } from 'mobx-react-lite';
import { isNumber, isString, isUndefined } from 'lodash';

const { Paragraph } = Typography;


const RepeatParam = observer(() => {
  let repeat;
  switch (store.selection.focusType) {
    case 'Event-Repeat':
      repeat = store.focusEvent!.repeat;
      break;
    case 'Group-Repeat':
      repeat = store.focusGroup!.repeat;
      break;
    case 'A2V-Repeat':
      repeat = store.focusA2V!.repeat;
      break;
  }

  return (
    <>
      <div className={gstyles.title}>REPEAT</div>
      <div className={gstyles.name}>Name</div>
      <Paragraph
        editable={{ onChange: store.current!.setName }} className={gstyles.context}
      >
        {repeat!.name}
      </Paragraph>
      <div className={gstyles.name}>Type</div>
      <div className={gstyles.context}>Repeat</div>
      <div className={gstyles.name}>Repeat Times</div>
      <InputNumber min={1} value={repeat!.times} onChange={(v) => {
        let value: number;
        if (isString(v))
          value = parseInt(v, 10);
        else if (isNumber(v))
          value = v;
        else
          return;
        if (isNaN(value))
          return;
        if (value < 1) value = 1;
        let t;
        let end;
        switch (store.selection.focusType) {
          case 'Event-Repeat':
            t = store.focusEvent!.durationWithRepeat;
            end = store.focusEvent!.endWithRepeat;
            break;
          case 'Group-Repeat':
            t = store.focusGroup!.durationWithRepeat;
            end = store.focusGroup!.endWithRepeat;
            break;
          case 'A2V-Repeat':
            t = store.focusA2V!.durationWithRepeat;
            end = store.focusA2V!.endWithRepeat;
            break;
        }
        repeat!.setRepeatTime(value);
        if (isUndefined(t))
          return;
        let delta;
        switch (store.selection.focusType) {
          case 'Event-Repeat':
            delta = store.focusEvent!.durationWithRepeat - t;
            break;
          case 'Group-Repeat':
            delta = store.focusGroup!.durationWithRepeat - t;
            break;
          case 'A2V-Repeat':
            delta = store.focusA2V!.durationWithRepeat - t;
            break;
        }

        if (delta > 0) {
          const tab = store.currentTab;
          if (isUndefined(tab))
            return;
          switch (tab.type) {
            case 'Root':
              const project = store.current;
              if (!isUndefined(project)) {
                project!.makesureLegal(end!, delta);
              }
              break;
            case 'Group':
              const group = store.currentGroup;
              if (!isUndefined(group)) {
                group!.makesureLegal(end! + group.start, delta);
              }
              break;
            case 'A2V':
              const a2v = store.currentA2V;
              if (!isUndefined(a2v)) {
                a2v!.makesureLegal(end! + a2v.start, delta);
              }
              break;
          }
        }
      }} />
      <div className={gstyles.name}>Interval</div>
      <InputNumber min={0} value={repeat!.interval} onChange={(v) => {
        let value: number;
        if (isString(v))
          value = parseInt(v, 10)
        else if (isNumber(v))
          value = v;
        else
          return;
        if (isNaN(value))
          return;
        let t;
        let end;
        switch (store.selection.focusType) {
          case 'Event-Repeat':
            t = store.focusEvent!.durationWithRepeat;
            end = store.focusEvent!.endWithRepeat;
            break;
          case 'Group-Repeat':
            t = store.focusGroup!.durationWithRepeat;
            end = store.focusGroup!.endWithRepeat;
            break;
          case 'A2V-Repeat':
            t = store.focusA2V!.durationWithRepeat;
            end = store.focusA2V!.endWithRepeat;
            break;
        }
        repeat!.setInterval(value);
        if (isUndefined(t))
          return;
        let delta;
        switch (store.selection.focusType) {
          case 'Event-Repeat':
            delta = store.focusEvent!.durationWithRepeat - t;
            break;
          case 'Group-Repeat':
            delta = store.focusGroup!.durationWithRepeat - t;
            break;
          case 'A2V-Repeat':
            delta = store.focusA2V!.durationWithRepeat - t;
            break;
        }

        if (delta > 0) {
          const tab = store.currentTab;
          if (isUndefined(tab))
            return;
          switch (tab.type) {
            case 'Root':
              const project = store.current;
              if (!isUndefined(project)) {
                project!.makesureLegal(end!, delta);
              }
              break;
            case 'Group':
              const group = store.currentGroup;
              if (!isUndefined(group)) {
                group!.makesureLegal(end! + group.start, delta);
              }
              break;
            case 'A2V':
              const a2v = store.currentA2V;
              if (!isUndefined(a2v)) {
                a2v!.makesureLegal(end! + a2v.start, delta);
              }
              break;
          }
        }
      }} />
    </>
  );
});

export default RepeatParam;