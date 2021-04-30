import React, { useState, useEffect, useRef } from 'react';
import { Graph } from '@antv/x6';
import createFlowChart from './createFlowChart';
import STYLES from './index.less';

interface IProps {
  onReady: (graph: Graph) => void;
}

const FlowChart: React.FC<IProps> = (props) => {
  const { onReady } = props;
  const wrapperRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<HTMLDivElement>(null);
  const [flowChart, setFlowChart] = useState<Graph>();

  useEffect(() => {
    if (graphRef.current ) {
      const flowChart = createFlowChart(graphRef.current);
      onReady(flowChart);
      setFlowChart(flowChart);
    }
  }, []);

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

  return(
    <div className={STYLES.wrap} ref={wrapperRef}>
      <div className={STYLES.flowChart} ref={graphRef} />
    </div>
  )
};

export default FlowChart;