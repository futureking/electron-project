import React, { useEffect, useState, useRef } from 'react';
import { Graph } from '@antv/x6';
import { Menu, ContextMenu } from '@antv/x6-react-components';
// import '@antv/x6-react-components/es/menu/style/index.css'
// import '@antv/x6-react-components/es/dropdown/style/index.css'
// import '@antv/x6-react-components/es/context-menu/style/index.css'
import STYLES from './index.less';

interface IProps {
  flowChart: Graph;
}



const RightMenu: React.FC<IProps> = (props) => {
  const { flowChart } = props
  const [visible, setVisible] = useState<boolean>(false);
  const [position, setPosition] = useState({x: null, y: null});
  const menuRef = useRef(null);
  useEffect(() => {
    flowChart.on('graph:showContextMenu', handler);
    return () => {
      flowChart.off('graph:showContextMenu', handler);
    };
  }, []);

  useEffect(() => {
    if (visible) {
      document.addEventListener("click", onHideMenu, false);
      return () => {
        document.removeEventListener("click", onHideMenu, false);
      };
    }
    return;
  }, [visible]);

  const onHideMenu = () => {
    setVisible(false);
  }
  const handler = (data) => {
    setVisible(true);
    setPosition({x: data.x + 50, y: data.y + 50})
  }

  const menu = (
    <Menu>
      <Menu.Item key="copy" onClick={() => onCopy}>Copy</Menu.Item>
      <Menu.Item key="paste" onClick={() => onPaste}>Paste</Menu.Item>
      <Menu.Item key="cut" onClick={() => onCut}>Cut</Menu.Item>
      <Menu.Item key="delete" onClick={() => onDelete}>Delete</Menu.Item>
    </Menu>
  )

  const onCopy = () => {

  }
  
  const onPaste = () => {

  }

  const onCut = () => {

  }

  const onDelete = () => {

  }

  return(
    <div ref={menuRef} className={STYLES.rightContent} style={{position: 'absolute', left: position.x +'px', top: position.y +'px'}}>
      <ContextMenu menu={menu} visible={visible}>
        <div></div>
      </ContextMenu>
    </div>
  )
}

export default RightMenu;
