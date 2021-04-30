import React from 'react';
import { Graph } from '@antv/x6';
import STYLES from './index.less';
import ParamPanel from '@/components/param-panel/param-panel';
import TabList from '@/pages/mainPage/components/TabList';
import PageTool from '@/pages/mainPage/components/PageTool';
import SideBar from '../SiderBar';

interface IProps {
  flowChart: Graph | undefined;
}

const Layout: React.FC<IProps> = (props) => {
  const { flowChart } = props;
  let sideBar;
  if (flowChart) {
    sideBar = <SideBar flowChart={flowChart} />;
  }
  return(
    <div className={STYLES.wrap}>
      <div className={STYLES.tabList}><TabList /></div>
      <div className={STYLES.toolbar}><PageTool /></div>
      <div className={STYLES.content}>
        <div className={STYLES.sideBar}>
         { sideBar }
        </div>
        <div className={STYLES.center}>
          {props.children}
        </div>
        <div className={STYLES.settingBar}>
          <ParamPanel />
        </div>
      </div>
    </div>
  )
};

export default Layout