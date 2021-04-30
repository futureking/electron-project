import React, { useState, useEffect } from 'react';
import { Graph } from '@antv/x6';
import { Button, Col, Modal, Input, Row } from 'antd';
import STYLES from './AddMusic.less';

interface IProps {
  visible?: boolean;
  flowChart?: Graph;
}

const AddMusicModal: React.FC<IProps>= (props) => {
  // const { flowChart } = props;
  const [ visible, setVisible] = useState<boolean>(false);
   // life
   useEffect(() => {
    // const handler = () => setVisible(true);
    // flowChart.on('graph:editCode', handler);
    return () => {
      // flowChart.off('graph:editCode', handler);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      // const cell = flowChart.getSelectedCells()[0];
      // const { code } = cell.getData() || {};
      // console.info(code)
    } else {
      console.info(22222)
    }
  }, [visible]);

  const onOk = (): void => {
    setVisible(false);
  };
  const onCancel = (): void => {
    setVisible(false);
  };

  return(
    <Modal
      className={STYLES.wrap}
      width={368}
      title="Background Music"
      visible={visible}
      okText="Import"
      cancelText="取消"
      onCancel={onCancel}
    >
      <Row>
        <Col span={18}>
          <Input placeholder="select audio here ..." type="file" />
        </Col>
        <Col span={5} offset={1}>
          <Button 
            onClick={onOk}
          >Add</Button>
        </Col>
      </Row>
    </Modal>
  )
}

export default AddMusicModal;