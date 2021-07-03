import React, { useState } from 'react';
import { Graph } from '@antv/x6';
import { observer } from 'mobx-react-lite';
// @ts-ignore
import SplitPane from 'react-split-pane/lib/SplitPane';
// @ts-ignore
import Pane from 'react-split-pane/lib/Pane';
import Layout from './layout';
import FlowChart from './flowChart';
import SelectorTool from '@/components/display-tools';
import { Track } from '@/components/track';
// import store from '@/stores';
// import { openProject } from '@/utils/file-utils';
import STYLES from './index.less';

const Main: React.FC = observer((props) => {
  const [flowChart, setFlowChart] = useState<Graph>();
  // const [height, setHeight] = useState<string>('calc(100% - 400px)');
  const onFlowChartReady = (flowChart: Graph): void => {
    setFlowChart(flowChart);
  }
  // const footerRef = useRef<HTMLDivElement>(null);
  // useEffect(() => {
  //   console.info(footerRef.current.clientHeight);
  //   setHeight(footerRef.current.clientHeight)
  // }, [height])

  const [total] = useState(10 * 60 * 1000);


  return (
    <div className={STYLES.wrap}>
      <Layout
        flowChart={flowChart}
      >
        <div className={STYLES.flowChart}>
          <FlowChart onReady={onFlowChartReady} />
        </div>
        <div className={STYLES.footer}>
          <div className={STYLES.timeLine}>
            <Track total={total} />
            <SelectorTool total={total} />
          </div>
        </div>
      </Layout>
    </div>
  )
})

export default Main;