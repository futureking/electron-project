import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { Graph } from '@antv/x6';
import { observer } from 'mobx-react-lite';
import { isUndefined } from 'lodash';
import createFlowChart from './createFlowChart';
import AddMusicModal from '../Modal/AddMusic';
import AtoVModal from '../Modal/AtoVModal';
import GropuModal from '../Modal/groupModal';
import EditCurveModal from '../Modal/editCurve';
// import RightMenu from './ContextMenu';
import { X6DataFormart } from '@/utils/x6-data-util';
import store from '@/stores';
import STYLES from './index.less';

interface IProps {
  onReady: (graph: Graph) => void;
}

const FlowChart: React.FC<IProps> = observer((props) => {
  const { onReady } = props;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const [flowChart, setFlowChart] = useState<Graph>();  
  const [chart, setChart] = useState<Graph>();


  useLayoutEffect(() => {
    if (graphRef.current ) {
      const chart = createFlowChart(graphRef.current);
      onReady(chart);
      setFlowChart(chart);
      setChart(chart);
    }
  }, []);
  
  if (graphRef.current && !isUndefined(chart) ) {
    const {data} = X6DataFormart(flowChart!);
    chart.fromJSON(data);
  }

  useEffect(() => {
    const handler = () => {
      requestAnimationFrame(() => {
        if (flowChart && wrapperRef && wrapperRef.current) {
          const width = wrapperRef.current.clientWidth;
          const height = wrapperRef.current.clientHeight;
          flowChart.resize(width, height);
        }
      });
    };
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('resize', handler);
    };
  }, [flowChart, wrapperRef]);

  useEffect(() => {
    flowChart && flowChart.centerContent();
  }, [JSON.stringify(store.currentTab)])

  return(
    <div className={STYLES.wrap} ref={wrapperRef}>
      <div className={STYLES.flowChart} ref={graphRef} />
      { flowChart && <AddMusicModal flowChart={flowChart} /> }
      { flowChart && <AtoVModal flowChart={flowChart} /> }
      { flowChart && <GropuModal flowChart={flowChart} />}
      {/* { flowChart && <RightMenu flowChart={flowChart} />} */}
      { flowChart && (store.focusEvent || store.focusGroup || store.focusA2V) && <EditCurveModal flowChart={flowChart} />}
    </div>
  )
});

export default FlowChart;