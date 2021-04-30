import React, { useState } from 'react';
import { Graph } from '@antv/x6';
// @ts-ignore
import SplitPane from 'react-split-pane/lib/SplitPane';
// @ts-ignore
import Pane from 'react-split-pane/lib/Pane';
import Layout from './layout';
import FlowChart from './flowChart';
import SelectorTool from '@/components/display-tools/selector-tool';
import { Track } from '@/components/track/track';

import STYLES from './index.less';


const Main: React.FC = (props) => {
  const [flowChart, setFlowChart] = useState<Graph>();

  const onFlowChartReady = (flowChart: Graph): void => {
    setFlowChart(flowChart);
  }

  return(
    <div className={STYLES.wrap}>
      <Layout
        flowChart={flowChart}
      >
        <SplitPane split={'horizontal'}>
          <Pane
            className={STYLES.flowChart}
          >
            <FlowChart onReady={onFlowChartReady} />
          </Pane>
          <Pane
            className={STYLES.timeLine}
            minSize={'300px'}
            maxSize={'500px'}
          >
            <Track />
            <SelectorTool />
          </Pane>
        </SplitPane>
      </Layout>
    </div>
  )
}

export default Main;