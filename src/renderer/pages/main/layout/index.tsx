import React, { useRef } from 'react';
import { Graph } from '@antv/x6';
import STYLES from './index.less';
import { Copy, Cut, Paste, execDelete } from '@/cmd';
import ParamPanel from '@/components/param-panel/index';
import TabList from '@/components/TabList';
import PageTool from '@/components/PageTool';
import ContextMenu from '@/components/ContextMenu';
import SideBar from '../SiderBar';
interface IProps {
  flowChart: Graph | undefined;
}

const Layout: React.FC<IProps> = (props) => {
  const { flowChart } = props;
  const centerRef = useRef<HTMLDivElement>(null);


  let sideBar, tabList;
  if (flowChart) {
    sideBar = <SideBar flowChart={flowChart} />;
    tabList = <TabList flowChart={flowChart} />
  }

  let data = {
    0: {
      name: 'Copy',
      method: () => Copy()
    },
    1: {
      name: 'Paste',
      method: () => Paste()
    },
    2: {
      name: 'Cut',
      method: () => Cut()
    },
    3: {
      name: 'Delete',
      method: () => execDelete()
    }
  }
  return(
    <div className={STYLES.wrap}>
      <div className={STYLES.tabList}>{ tabList }</div>
      <div className={STYLES.toolbar}><PageTool /></div>
      <div className={STYLES.content} ref={centerRef}>
        <div className={STYLES.sideBar}>
          { sideBar }
        </div>
        <div className={STYLES.center}>
          <ContextMenu menuList={data} >
            {props.children}
          </ContextMenu>
        </div>
        <div className={STYLES.settingBar}>
          <ParamPanel />
        </div>
      </div>
    </div>
  )
};

export default Layout