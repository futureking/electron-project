import { useState } from 'react';
import { Typography, Button, Popover, Select, message } from 'antd';
import gstyles from '../index.less';
import styles from './index.less';
import store from '@/stores';
import { observer } from 'mobx-react-lite';
import { isNull, isUndefined } from 'lodash';
import ProjectParam from '../project'
import { LOC_AUDIO, M2V } from '@/../share/define/message';
import { IpcImportAudioProps } from '@/../share/define/ipc';
import { HeV1, HeV2 } from '@/../share/data/IRichTap';
import { ResetA2v } from '@/utils/he-utils';
const { Paragraph } = Typography;
const { Option } = Select;
const { ipcRenderer } = window;

const content = (path: string) => {
  return (
    <div style={{ wordBreak: 'break-all' }}>
      <p>{path}</p>
    </div>
  );
};

const A2VParam = observer(() => {
  const project = store.current;
  const obj = store.focusA2V;
  const [style, setStyle] = useState(1);

  const findLoc = () => {
    if (isUndefined(obj) || isUndefined(project)) return;

    const audio = obj.audio;
    if (!isNull(audio) && !isUndefined(audio)) {
      ipcRenderer.invoke(LOC_AUDIO, audio.path, project.name).then(r => {
        if (isUndefined(r))
          return;
        let res = r as IpcImportAudioProps;
        ipcRenderer.invoke(M2V, res.src,
          project.name).then(r2 => {
            if (isUndefined(r2)) {
              message.error("Muisc to vibration generate failed")
              return;
            }
            let heObj: HeV1 | HeV2;
            if (r2.version === 1) {
              heObj = JSON.parse(r2.data) as HeV1;
            }
            else if (r2.version === 2) {
              heObj = JSON.parse(r2.data) as HeV2;
            }
            else
              return
            if (!isUndefined(heObj)) {
              ResetA2v(obj, res.name, heObj, res);
            }
          })
      });
    }
  }
  return (
    !isUndefined(obj) ?
      <>
        <div className={gstyles.title}>Sound TO VIBRATION</div>
        <div className={gstyles.name}>Name</div>
        <Paragraph
          editable={{ maxLength: 20, onChange: obj.setName }} className={gstyles.context}
        >
          {obj.name}
        </Paragraph>
        <div className={gstyles.name}>Type</div>
        <div className={gstyles.context}>Sound to Vibration</div>
        <div className={gstyles.name}>Sound File</div>
        <Popover content={content(obj.audio.path)} trigger="hover" overlayStyle={{ width: 240 }}>
          <div className={gstyles.context}>{obj.audio.path}</div>
        </Popover>
        <Button type="primary" ghost block className={styles.button} onClick={findLoc}>Find</Button>
        <div className={gstyles.name}>Duration</div>
        <div className={gstyles.context}>{obj.duration}</div>
        <div className={gstyles.name}>Style</div>
        <Select defaultValue={style} className={styles.select} onChange={(value) => setStyle(value)}>
          <Option value={1}>Style1</Option>
          <Option value={2}>Style2</Option>
        </Select>
        <Button type="primary" ghost block className={styles.button}>Apply</Button>
      </>
      : <ProjectParam />
  );
});

export default A2VParam;