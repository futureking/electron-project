import { CONNECT, DISCONNECT, GET_IP, TRANSMIT } from '../../../../../share/define/message';
import React, { useState, useEffect } from 'react';
import STYLES from './index.less';
import { Popover, Badge } from 'antd';
import QRCode from 'qrcode.react'
import store from '@/stores';
import { formatHe } from '@/utils/he-utils';
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
      <p>{ip}:{port}</p>
      <QRCode value={url} />
    </div>)
}

const PageTool: React.FC = (props: any) => {
  const [ip, setIp] = useState('');
  const [link, setLink] = useState(false);
  const [heartbeat, setHeartbeat] = useState(false);
  const onConnect = () => {
    ipcRenderer.invoke(GET_IP).then(r => {
      console.log(r);
      setIp(r);
    })
  };

  const onPlay = async () => {
    if (store.selection.pid === '')
      return;

    let stream = formatHe();
    let audio = store.current!.background;
    ipcRenderer.send(TRANSMIT, audio, stream);
  };

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
      if(res) {
        console.log('ok');
      }
    });
  }, [])
  return (
    <div className={STYLES.wrap}>
      <ul className={STYLES.left}>
        <li><img src={require('./imgs/arrow.svg')} /></li>
        <li><img src={require('./imgs/refresh.svg')} /></li>
        <li><img src={require('./imgs/hand.svg')} /></li>
        <li><img src={require('./imgs/filter.svg')} /></li>
      </ul>
      <ul className={STYLES.right}>
        <Popover content={QRCodePopup({ ip: ip, port: 3000 })} trigger="click" placement="bottom">
          <li onClick={onConnect}>
            <Badge dot
              color = {link ? (heartbeat ? 'green' : 'red'):'#00000000'}
              offset={[1, 13]}>
              <img src={require('./imgs/connnect.svg')} />
            </Badge>
          </li>
        </Popover>
        <li><img src={require('./imgs/play.svg')} onClick={onPlay} /></li>
        <li><img src={require('./imgs/save.svg')} /></li>
      </ul>
    </div>
  )
}

export default PageTool;
