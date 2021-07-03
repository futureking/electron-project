import store from "@/stores";
import { intensToH, intensToY, timeToWidth, timeToX } from "@/utils/draw-utils";
import { observer } from "mobx-react-lite";
import Repeat from '../repeat';

interface ContinuousProps {
  ppms: number;
  height: number;
  id: string;
  time: number;
  intensity: number;
  duration: number;
  frequency: number;
  repeat: number;
  interval: number;
  curve: Array<any>;
  showRepeatInd: boolean;
}

const ContinuousEvent = observer((props: ContinuousProps) => {
  const { id, time, intensity, frequency, duration, ppms, height, repeat, interval, curve, showRepeatInd } = props;

  const x = timeToX(time, ppms);
  const y = intensToY(intensity, height, 32);
  const w = timeToWidth(duration, ppms);
  const h = intensToH(intensity, height, 32);

  // const path = () => {
  //   let p = 'M' + x + ' ' + intensToY(0, height, 32);
  //   for (let i = 1; i < curve.length; i++) {
  //     p += ' L' + timeToX(time + curve[i].time, ppms) + ' ' + intensToY(intensity * curve[i].intensity, height, 32);
  //   }
  //   p += ' Z'
  //   return p;
  // }

  const lines = () => {
    let ret = `${x},${height}`;
    for (let i = 1; i < curve.length; i++) {
      ret += ` ${timeToX(time + curve[i].time, ppms)},${intensToY(intensity * curve[i].intensity, height, 32)}`;
    }
    return ret;
  }
  let repeatE = new Array<any>();
  for (let i = 0; i < repeat; i++) {
    const repeatT = i * duration + interval * i;
    const repeatX = timeToX(repeatT, ppms);

    repeatE.push(
      <use key={i + 1} x={repeatX} xlinkHref={'#' + id}      
        // onClick={(event) => doSelect(event, i, id, time, duration)}
        onMouseDown={(event) => {
          if (i !== 0) return;
          store.selection.selectEvent(id);
          store.selector.setStart(time);
          store.selector.setEnd(time + duration * repeat + interval * (repeat-1));
          // console.log('down', event.clientX, event.nativeEvent.offsetX, event.nativeEvent.offsetX - x, y + h - event.nativeEvent.offsetY);
          store.selection.setOP('Position', event.nativeEvent.offsetX - x, y + h - event.nativeEvent.offsetY);
        }} />
    );
  }

  const focused = store.focusEvent && store.focusEvent.id === id;
  return (
    <>
      <defs>
        <linearGradient id={`gradient-${id}`} x={x} y={y} width={w} height={h}>
          {
            curve.map((v, i) => {
              return (
                <stop key={id + '-' + i} offset={v.time / duration} stopColor="#F4D75C" stopOpacity={(v.frequency + frequency) / 100} />
              )
            })
          }
        </linearGradient>
      </defs>
      <defs>
        <g id={id} key={id} type='event'>
          <rect x={x} y={y} width={w} height={h}
            rx={4} ry={4}
            fill='#CEBA00'
            fillOpacity={focused ? 0.1 : 0.06}
            stroke={focused ? 'white' : 'transparent'}
          />
          <polygon points={lines()} /*stroke='black' strokeWidth={1}*/ fill={`url(#gradient-${id})`} />
        </g>
      </defs>
      {repeatE}
      {
        showRepeatInd && repeat > 1 &&
        <Repeat id={id} type="Event" x={x} w={timeToWidth((duration * repeat + interval * (repeat - 1)), ppms)} />
      }
    </>
  );
});

export default ContinuousEvent;