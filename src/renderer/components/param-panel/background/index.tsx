import { Typography, Button, Popover } from 'antd';
import gstyles from '../index.less';
import styles from './index.less';
import store, { undoManager } from '@/stores';
import { observer } from 'mobx-react-lite';
import ProjectParam from '../project';
import { LOC_AUDIO } from '@/../share/define/message';
import { isNull, isUndefined } from 'lodash';
import { IpcImportAudioProps } from '@/../share/define/ipc';

const { Paragraph } = Typography;
const { ipcRenderer } = window;
const content = (path: string) => {
  return (
    <div style={{ wordBreak: 'break-all' }}>
      <p>{path}</p>
    </div>
  );
};

const BGParam = observer(() => {
  const project = store.current;
  const findLoc = () => {
    if (isUndefined(project)) return;

    const audio = project.background;
    if (!isNull(audio) && !isUndefined(audio))
      ipcRenderer.invoke(LOC_AUDIO, audio.path, project.name).then(r => {
        if (isUndefined(r))
          return;
        let res = r as IpcImportAudioProps;
        undoManager.get(project.id).startGroup(() => {
          project.clearBackground();
          project.setBackground(res.name, res.src, res.wav, res.data, res.rate, res.duration, res.samples);
        });
        undoManager.get(project.id).stopGroup();
      });
  }

  return (
    project && project.background ?
      <>
        <div className={gstyles.title}>BACKGROUND MUSIC</div>
        <div className={gstyles.name}>Name</div>
        <Paragraph
          editable={{ maxLength: 20, onChange: store.current.background.setName }} 
          className={gstyles.context}
        >
          {store.current.background.name}
        </Paragraph>
        <div className={gstyles.name}>Type</div>
        <div className={gstyles.context}>Background Music</div>
        <div className={gstyles.name}>Audio File</div>
        <Popover content={content(store.current.background.path)} trigger="hover" overlayStyle={{ width: 240 }}>
          <div className={gstyles.context}>{store.current.background.path}</div>
        </Popover>
        <Button type="primary" ghost block className={styles.background} onClick={findLoc}>Find</Button>
        <div className={gstyles.name}>Duration</div>
        <div className={gstyles.context}>{`${store.current.background.duration} s`}</div>
      </>
      : <ProjectParam />
  );
});

export default BGParam;