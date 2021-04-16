import React, { useState, useEffect } from 'react';
import { SplitBox } from '@antv/x6-react-components';
import { observer } from 'mobx-react-lite';
import TabList from './components/TabList';
import FlowGraph from '@/components/Graph';
// import StreamGraph from './components/StreamGraph';
import ParamPanel from '@/components/param-panel/param-panel';
import PageTool from './components/PageTool';
import ConfigPanel from '@/components/ConfigPanel';
import ToolBar from './components/Toolbar';
import SelectorTool from '@/components/display-tools/selector-tool';
import { Track } from '@/components/track/track';
import store from '@/stores';
import '@antv/x6-react-components/es/split-box/style/index.css';

import STYLES from './index.less';

const DashBoard: React.FC = observer(() => {
  // console.info(store)
  console.info(store.projectStore)
  const [isReady, setIsReady] = useState(false)

  const getContainerSize = () => {
    return {
      width: document.body.offsetWidth - 581,
      height: document.body.offsetHeight - 87,
    }
  }

  useEffect(() => {
    const graph = FlowGraph.init()
    setIsReady(true)

    const resizeFn = () => {
      const { width, height } = getContainerSize()
      graph.resize(width, height)
    }
    resizeFn()

    window.addEventListener('resize', resizeFn)
    return () => {
      window.removeEventListener('resize', resizeFn)
    }
  }, [])

  return(
    <div className={STYLES.wrap}>
      <div className={STYLES.header}>
        <div className={STYLES.tabList}>
          <TabList />
        </div>
        <div className={STYLES.toolbar}>
          <PageTool />
        </div>
      </div>
      <div className={STYLES.content}>
        <SplitBox
          split="vertical"
          size={280}
          resizable={false}
          primary="first"
        >
          <div className={STYLES.area}>
            {/* <div id="stencil" className={STYLES.sider}>
              <StreamGraph />
            </div> */}
            <div id="stencil" className={STYLES.sider}>
              {/* <StreamGraph /> */}
            </div>
          </div>
          <div className={STYLES.area}>
            <SplitBox
              split="vertical"
              minSize={40}
              maxSize={-80}
              resizable={false}
              defaultSize={300}
              primary="second"
            >
              <div className={STYLES.area}>
                <SplitBox
                  split="horizontal"
                  minSize={40}
                  maxSize={-40}
                  defaultSize={450}
                  primary="first"
                >
                  <div className={STYLES.area} >
                    <div className={STYLES.panel}>
                      <div className={STYLES.toolbar}><ToolBar /></div>
                      <div id="container" className="x6-graph" />
                    </div>
                    {/* <div className={STYLES.panel}>
                      <div id="container" className="x6-graph" />
                    </div> */}
                  </div>
                  <div className={STYLES.area} >
                    <Track />
                    <SelectorTool />
                  </div>
                </SplitBox>
              </div>
              <div className={STYLES.area} >
                <div className={STYLES.config}>{isReady && <ParamPanel />}</div>
              </div>
            </SplitBox>
          </div>
        </SplitBox>
      </div>
    </div>
  )
})

export default DashBoard;