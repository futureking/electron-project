import React, { useContext, useState, useRef } from 'react';
import { observer } from "mobx-react-lite";
import TimeTrack from '../time';
import Scale from '../scale';
import ContextMenu from '@/components/ContextMenu';
import { timeToX, timeToWidth, xToTime } from "@/utils/draw-utils";
import { intensToY, yToIntens } from '../scale-util';
import { Context } from '../../editCurve';
import STYLES from './index.less';

interface IProps {
  id: string;
  time: number;
  curveList?: Array<Curve>;
  changeFocus:Function;
  duration: number;
  frequency: number;
  intensity: number;
  ppms: number;
  onAddPoint: Function;
}
interface Curve {
  frequency: number;
  intensity: number;
  time: number;
  hover: boolean;
}
interface IStore {
  curveData: Array<Curve>,
  focus: number,
  setFocus: Function,
  setInit: Function,
  changeRelative: Function,
  changIntensity: Function,
  changFrequency: Function,
  onChangeData: Function,
  onDelCurvePoint: Function
}

const CurveChart: React.FC<IProps> = observer((props) => {
  const { id, time=700, changeFocus, frequency=1, intensity=1, ppms=0.7, duration=1, onAddPoint } = props;
  const svgRef = useRef<SVGSVGElement>(null);
  const [addPosition, setAddPosition] = useState({x:0, y: 0})
  const [addShow, setAddShow] = useState(false);
  const curveStore:IStore|null = useContext(Context);


  const height = 350;
  const lines = () => {
    let ret = `0,350`;
    if(curveStore!.curveData!) {
      for (let i = 0; i < curveStore!.curveData!.length; i++) {
        ret += ` ${timeToX(curveStore!.curveData[i].time!, ppms)},${intensToY(curveStore!.curveData[i].intensity!, 350, 32)}`;
      }
    }
    return ret;
  }
  const x = timeToX(time, ppms);
  const y = intensToY(intensity, height, 32);
  const w = timeToWidth(duration, ppms);
  const h = yToIntens(intensity, height);


  const onMove = (event: React.MouseEvent) => {
    if(event.ctrlKey) {
      if(curveStore!.focus !==0 && curveStore!.focus!==curveStore!.curveData!.length-1) {
        const element = svgRef?.current?.getBoundingClientRect();
        let newX = event.clientX - element!.x - 5;
        let newY = event.clientY - element!.y - 5;
        let newD = xToTime(newX, ppms);
        let newH = yToIntens(newY, height);
        curveStore!.onChangeData(newH, newD);
      }
      
    }
  };

  const onFocusClick = (e, item, index) => {
    console.info(index)
    changeFocus(index);
  }

  const onAdd = () => {
    onAddPoint(addPosition);
  }

  let data = {
    0: {
      name: 'Delete',
      method: () => curveStore!.onDelCurvePoint()
    }
  }

  return(
    <div className={STYLES.wrap}>
      <ContextMenu menuList={data} >
        <div className={STYLES.leftScale}>
          <Scale height={350} />
        </div>
        <div className={STYLES.rightContent}>
          <svg width={700} height={350} fill="#1E2227" ref={svgRef}
            onMouseMove={(event) => onMove(event)}
            onMouseOut={(event) => onMove(event)}
            // onMouseDown={(event) => onClick(event)}
          >
            <defs>
              <linearGradient id={`paint0_linear`} x={x} y={y} width={w} height={h}>
                {
                  curveStore!.curveData && curveStore!.curveData!.map((v, i) => {
                    return (
                      <stop key={id + '-' + i} offset={v.time! / duration} stopColor="#F4D75C" stopOpacity={(v.frequency! + frequency) / 100} />
                    )
                  })
                }
              </linearGradient>
            </defs>
            <>
              <polyline
                points={lines()}
                strokeWidth={8} 
                pointerEvents="stroke"
                fill={`url(#paint0_linear)`} 
                onMouseOver={(e) => {
                  const element = svgRef?.current?.getBoundingClientRect();
                  setAddShow(true);
                  setAddPosition({x: e.clientX - element!.x - 5, y: e.clientY - element!.y - 5});
                }}
                onMouseOut = {() => {
                  setAddShow(false)
                }}
              />
              <image
                className={STYLES.add}
                x={addPosition.x}
                y={addPosition.y}
                href={require('@/assets/images/point_add.png')}
                style={{
                  display:addShow ? 'block' : 'none'
                }}  
                onClick={() => onAdd()}
              />
              {
                curveStore!.curveData && curveStore!.curveData!.map((item, index) => {
                  if(index===0 || index === curveStore!.curveData!.length-1) {
                    return(
                      <image 
                        key={index}
                        style={{cursor: 'pointer'}}
                        x={item.time && item.time===0 ? 0 : timeToX(item.time, ppms) - 16} 
                        y={item.intensity && item.intensity===0 ? 350 : intensToY(item.intensity, 350, 32) - 20} 
                        href={item.hover ? require('@/assets/images/point_focus.png') : require('@/assets/images/point_unchoose.png')} 
                        onMouseDown={(e) => onFocusClick(e, item, index)}
                      />
                    )
                  } else {
                    return(
                      <image 
                        key={index}
                        style={{cursor: 'pointer', zIndex: index===0 || index===curveStore!.curveData.length-1 ? 0 : index }}
                        x={item.time && timeToX(item.time, ppms) - 15} 
                        y={item.intensity && item.intensity===0 ? 350 : intensToY(item.intensity, 350, 32) - 15} 
                        href={item.hover ? require('@/assets/images/point_focus.png') : require('@/assets/images/point_unchoose.png')} 
                        onMouseDown={(e) => onFocusClick(e, item, index)}
                      />
                    )
                  }
                })
              }
              <text>
                {curveStore!.curveData && curveStore!.curveData!.map((item, index) => {
                  return `${timeToX(item.time, ppms) - 15}  + '===' + ${intensToY(item.intensity, 350, 32) - 12}`
                })
                }
              </text>
            </>
          </svg>
          <TimeTrack duration={duration} />
        </div>
      </ContextMenu>
    </div>
  )
})
export default CurveChart;
