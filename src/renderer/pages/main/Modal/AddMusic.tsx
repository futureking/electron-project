import React, { useState, useEffect, useRef } from 'react';
import { Graph } from '@antv/x6';
import { Modal, notification } from 'antd';
import { SmileOutlined } from '@ant-design/icons';
import { importAudio } from '@/cmd';
import STYLES from './AtoVModal.less';

interface IProps {
  flowChart: Graph;
}

const AddMusicModal: React.FC<IProps>= (props) => {
  const { flowChart } = props;
  const [ visible, setVisible] = useState<boolean>(false);
  const [filePath, setFilePath] = useState<string>('Select audio here');
  const fileRef = useRef<any>();
  const handler = () => {
    setVisible(true);
  };
   // life
  useEffect(() => {
    flowChart.on('graph:showAddMusicModal', handler);
    return () => {
      flowChart.off('graph:showAddMusicModal', handler);
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
    if(filePath === 'Select audio here'){
      openNotification();
    }else {
      importAudio(filePath);
      setVisible(false);
    }
  };
  const onCancel = (): void => {
    setVisible(false);
  };

  const onGetFiles = () => {
    fileRef.current.click();
  }

  const onFileChange = (e) => {
    const fileData = e.target.files[0];
    setFilePath(fileData.path);
  }

  return(
    <Modal
      className={STYLES.wrap}
      width={368}
      title="Background Music"
      visible={visible}
      okText="Import"
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
            style={{display: 'none'}}
            onChange={(e) => onFileChange(e)}
          />
          <div className={STYLES.btn} onClick={onGetFiles}>Add</div>
        </div>
      </div>
    </Modal>
  )
}

export default AddMusicModal;