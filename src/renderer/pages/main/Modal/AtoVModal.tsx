import React, { useState, useEffect, useRef } from 'react';
import { Graph } from '@antv/x6';
import { Modal, notification, message } from 'antd';
import { SmileOutlined } from '@ant-design/icons';

import STYLES from './AtoVModal.less';
import { IMPORT_AUDIO, M2V } from '@/../share/define/message';
import { IpcImportAudioProps } from '@/../share/define/ipc';
import store, { undoManager } from '@/stores';
import { addHeAsA2V } from '@/utils/he-utils';
import { HeV1, HeV2 } from '@/../share/data/IRichTap';
import { canAddPkg, getTime } from '@/cmd';

const { ipcRenderer } = window;



interface IProps {
  flowChart: Graph;
}

const Data = [
  {
    id: 1,
    name: 'Music to Vibration',
    value: true
  },
  {
    id: 2,
    name: 'Audio to Vibration',
    value: false
  }
];

const AtoVModal: React.FC<IProps> = (props) => {
  const { flowChart } = props;
  const [visible, setVisible] = useState<boolean>(false);
  const [, setValue] = useState<number>();
  const [filePath, setFilePath] = useState<string>('Select audio here');
  const fileRef = useRef<any>();
  const handler = () => {
    // console.info(value)
    setVisible(true);
  };
  // life
  useEffect(() => {
    flowChart.on('graph:showAtoVModal', handler);
    return () => {
      flowChart.off('graph:showAtoVModal', handler);
    };
  }, []);

  const openNotification = () => {
    notification.open({
      message: 'Richtap warm hint:',
      description:
        'Please select the audio file first ~',
      icon: <SmileOutlined style={{ color: '#2BBED1' }} />,
    });
  };


  const onOk = (): void => {
    if (filePath === 'Select audio here') {
      openNotification();
    } else {
      ipcRenderer.invoke(IMPORT_AUDIO, filePath, store.current!.name).then((r1) => {
        if (typeof r1 === 'undefined')
          return;
        let res = r1 as IpcImportAudioProps;
        ipcRenderer.invoke(M2V, filePath, store.current!.name).then((r2) => {
          // console.info(r2);
          if (typeof (r2) === 'undefined') {
            message.error("audio to vibration failed")
            return;
          }
          let obj: HeV1 | HeV2;
          if (r2.version === 1) {
            obj = JSON.parse(r2.data) as HeV1;
          }
          else if (r2.version === 2) {
            obj = JSON.parse(r2.data) as HeV2;
          }
          else
            return
          const id = store.current!.id;
          if (!!obj) {
            const end = getTime();
            if (canAddPkg(end, 0)) {
              undoManager.get(id).startGroup(() => addHeAsA2V(end, res.name, obj, res));
              undoManager.get(id).stopGroup();
            }
            else
              message.error(`Current time ${end} has deployed assets`);
          };
        })

        // store.current!.(res.name, res.url, res.data, res.rate, res.duration, res.samples);
      });
      setVisible(false);
    }

  };
  const onCancel = (): void => {
    setVisible(false);
  };
  const onChoose = (index: number) => {
    Data.map(item => item.value = false);
    Data[index].value = true;
    setValue(Data[index].id);
  }

  const onGetFiles = () => {
    fileRef.current.click();
  }

  const onFileChange = (e) => {
    const fileData = e.target.files[0];
    setFilePath(fileData.path);
  }

  return (
    <Modal
      className={STYLES.wrap}
      width={368}
      title="Sound to Vibration"
      visible={visible}
      okText="Generate"
      onOk={onOk}
      onCancel={onCancel}
    >
      <div className={STYLES.fileLine}>
        <div className={STYLES.fileText}>
          <input type="text" value={filePath} readOnly />
        </div>
        <div >
          <input
            ref={fileRef}
            type="file"
            accept=".mp3,.wav,.ogg"
            style={{ display: 'none' }}
            onChange={(e) => onFileChange(e)}
          />
          <div className={STYLES.btn} onClick={onGetFiles}>Add</div>
        </div>
      </div>
      <div className={STYLES.content}>
        <p>Model</p>
        <ul>
          {
            Data.map((item, index) => {
              return (
                <li key={item.id}
                  onClick={() => onChoose(index)}
                >
                  <i><img src={item.value ? require('./imgs/chosed.svg') : require('./imgs/unChoose.svg')} alt="" /></i>
                  <span>{item.name}</span>
                  {/* <label><img src={require('./imgs/info.svg')} alt="" /></label> */}
                </li>
              )
            })
          }
        </ul>
      </div>
    </Modal>
  )
}

export default AtoVModal;