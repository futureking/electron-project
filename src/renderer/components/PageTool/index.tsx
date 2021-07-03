import { CONNECT, DISCONNECT, GET_IP, TRANSMIT } from '../../../share/define/message';
import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import STYLES from './index.less';
import { Popover, Badge, message } from 'antd';
import QRCode from 'qrcode.react'
import store, { undoManager } from '@/stores';
import { formatHe } from '@/utils/he-utils';
import { Dropdown, Menu } from 'antd';
import { CheckOutlined, PauseOutlined, LeftOutlined } from '@ant-design/icons';
import { exportHe } from '@/cmd';
import { isUndefined } from 'lodash';
import { observer } from 'mobx-react-lite';
import { wavesurfer } from '../track/player';

const { ipcRenderer } = window;
interface QRCodeProps {
  ip: string;
  port: number;
}

const QRCodePopup = (props: QRCodeProps) => {
  const { ip, port } = props;
  const url = `http://${ip}:${port}/`;
  return (
    ip !== '' &&
    <div>
      <p>Please Download iOS demo APP from App Store to Scan the QR Code down below in order to feel the haptic your designed.</p>
      <QRCode value={url} size={208} />
    </div>
  )
}

const PageTool: React.FC = observer((props: any) => {
  const [ip, setIp] = useState('');
  const [link, setLink] = useState(false);
  const [heartbeat, setHeartbeat] = useState(false);
  const onConnect = () => {
    ipcRenderer.invoke(GET_IP).then(r => {
      console.log('current internal ip:', r);
      setIp(r);
    })
  };

  const [playing, setPlaying] = useState(false);

  const playOnMobile = (audio: string) => {
    let stream = formatHe();
    if (isUndefined(stream) || stream === '') {
      message.error("Current has no events to export");
      return;
    }
    ipcRenderer.send(TRANSMIT, audio, stream);
  }


  const playOnPC = () => {
    if (isUndefined(wavesurfer)) return;
    wavesurfer.on('finish', () => {
      setPlaying(false);
    })
    wavesurfer.playPause();
    setPlaying(!playing);
  }
  const onPlay = async () => {
    const tab = store.currentTab;
    const project = store.current;

    if (tab && project) {
      let audio = store.audioPath;
      if (playMode === 1) {
        playOnMobile(audio);
      }
      else {
        playOnPC();
      }
    }
  };

  const [playMode, setPlayMode] = useState(1);
  const menu = (
    <Menu style={{ width: 180, background: '#464E59' }}>
      <Menu.Item key="0" onClick={() => setPlayMode(1)}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 2px' }}>
          <div>Play on mobile</div>
          {playMode === 1 && <CheckOutlined />}
        </div>
      </Menu.Item>
      <Menu.Item key="1" onClick={() => setPlayMode(2)}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 2px' }}>
          <div>Play audio on PC</div>
          {playMode === 2 && <CheckOutlined />}
        </div>
      </Menu.Item>
    </Menu>
  );

  useEffect(() => {
    ipcRenderer.on(CONNECT, (event, data) => {
      console.log(`client ${data} connected`);
      setLink(true);
      setHeartbeat(true);
    });
    ipcRenderer.on(DISCONNECT, (event, data) => {
      console.log(`client ${data} disconnected`);
      setLink(true);
      setHeartbeat(false);
    });
    ipcRenderer.on(TRANSMIT, (event, res, msg) => {
      console.log('res:', res, ', msg:', msg)
      if (res) {
        console.log('ok');
      }
    });
  }, []);
  const onBack = () => {
    const tab = store.currentTab;
    if (isUndefined(tab)) return;
    const canBack = tab && tab.type !== 'Root';
    if (canBack) {
      if (tab.type === 'Group') {
        const group = store.currentGroup;
        if (isUndefined(group)) return;
        console.log('delta duration', group.duration - tab.initduration);
        store.current!.makesureLegal(group.start, (group.duration - tab.initduration) * group.repeat.times, group.id);
      }
      else if (tab.type === 'A2V') {
        const a2v = store.currentA2V;
        if (isUndefined(a2v)) return;
        console.log('delta duration', a2v.duration - tab.initduration);
        store.current!.makesureLegal(a2v.start, (a2v.duration - tab.initduration) * a2v.repeat.times, a2v.id);
      }
      tab.backRoot();
      store.selection.selectRoot();
      store.selection.setInd('Pointer');
      store.selector.reset();
    }
  }
  const canUndo = (): boolean => {
    const tab = store.currentTab;
    if (!isUndefined(tab)) {
      const id = tab.rootid;
      return undoManager.has(id) && undoManager.get(id).canUndo && (tab.type === 'Root' ? true : tab.step < undoManager.get(id).undoLevels);
    }
    else
      return false;
  }
  const canRedo = (): boolean => {
    const tab = store.currentTab;
    if (!isUndefined(tab)) {
      const id = tab.rootid;
      return undoManager.has(id) && undoManager.get(id).canRedo;
    }
    else
      return false;
  }
  return (
    <div className={STYLES.wrap}>
      <ul className={STYLES.left}>
        {
          store.currentTab && store.currentTab.type !== 'Root' &&
          <li onClick={() => onBack()}><LeftOutlined /></li>
        }
        <li className={classnames({ [STYLES.actived]: store.selection.indType === 'Pointer' })} onClick={() => { store.selection.setInd('Pointer'); }}><img src={require('./imgs/arrow.svg')} /></li>
        {/* <li className={classnames({ [STYLES.actived]: store.selection.indType === 'Hand' })} onClick={() => store.selection.setInd('Hand')}><img src={require('./imgs/hand.svg')} /></li> */}
        <li className={classnames({ [STYLES.actived]: store.selection.indType === 'Time' })} onClick={() => store.selection.setInd('Time')}><img src={require('./imgs/pointer.svg')} /></li>
        <li className={STYLES.border} onClick={() => {
          const tab = store.currentTab;
          const enable = canUndo();
          if (!isUndefined(tab) && enable) {
            const id = tab.rootid;
            undoManager.get(id).canUndo && undoManager.get(id).undo();
          }
        }} >
          <img src={require('./imgs/undo.svg')} /></li>
        <li onClick={() => {
          const tab = store.currentTab;
          const enable = canRedo();
          if (!isUndefined(tab) && enable) {
            const id = tab.rootid;
            undoManager.get(id).canRedo && undoManager.get(id).redo();
          }
        }} ><img src={require('./imgs/redo.svg')} /></li>
      </ul>
      <ul className={STYLES.right}>
        <Popover content={QRCodePopup({ ip: ip, port: 3000 })} trigger="click" placement="bottom" title="CONNECT PHONE" color="#464E59" overlayStyle={{ width: 240 }}>
          <li onClick={onConnect}>
            <Badge dot
              color={link ? (heartbeat ? 'green' : 'red') : '#00000000'}
              offset={[1, 13]}>
              <img src={require('./imgs/connnect.svg')} />
            </Badge>
          </li>
        </Popover>
        <li>
          <div style={{ display: 'inline-block', paddingLeft: 6, paddingRight: 6 }} onClick={onPlay}>
            {playing ? <PauseOutlined /> : <img src={require('./imgs/play.svg')} />}
          </div>
          <Dropdown overlay={menu} placement="bottomCenter" trigger={['click']}>
            <div style={{ paddingLeft: 6, paddingRight: 6, display: 'inline-block', float: 'right' }}>
              <img src={require('./imgs/vector.svg')} />
            </div>
          </Dropdown>
        </li>
        <li onClick={exportHe}><img src={require('./imgs/save.svg')} /></li>
      </ul>
    </div>
  )
});

export default PageTool;
