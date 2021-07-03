import store from "@/stores";
import { intensToH, intensToY, timeToWidth, timeToX } from "@/utils/draw-utils";
import { observer } from "mobx-react-lite";
import Repeat from '../repeat';
interface EventProps {
  ppms: number;
  height: number;
  id: string;
  time: number;
  intensity: number;
  duration: number;
  frequency: number;
  repeat: number;
  interval: number;
  showRepeatInd: boolean;
}

const TransientEvent = observer((props: EventProps) => {
  const { id, time, intensity, duration, ppms, height, repeat, interval, showRepeatInd } = props;
  const x = timeToX(time, ppms);
  const y = intensToY(intensity, height, 32);
  const w = timeToWidth(duration, ppms);
  const h = intensToH(intensity, height, 32);

  let repeatE = new Array<any>();
  for (let i = 0; i < repeat; i++) {
    const repeatT = i * duration + interval * i;
    const repeatX = timeToWidth(repeatT, ppms);
    repeatE.push(
      <use key={i + 1} x={repeatX} xlinkHref={'#' + id} onMouseDown={(event) => {
        if (i !== 0) return;
        store.selection.selectEvent(id);
        store.selector.setStart(time);
        store.selector.setEnd(time + duration * repeat + interval * (repeat-1));
        store.selection.setOP('Position', event.nativeEvent.offsetX - x, y + h - event.nativeEvent.offsetY);
      }} />
    );
  }

  const focused = store.focusEvent && store.focusEvent.id === id;

  return (
    <>
      <defs>
        <g id={id} key={id} type='event'>
          <rect x={x} y={y} width={w} height={h}
            rx={4} ry={4}
            fill='#2FB3DA'
            fillOpacity={focused ? 1 : 0.4}
            stroke={focused ? 'white' : 'black'}
            strokeWidth={1}
          />
        </g >
      </defs>
      {repeatE}
      {
        showRepeatInd && repeat > 1 &&
        <Repeat id={id} type="Event" x={x} w={timeToWidth((duration * repeat + interval * (repeat - 1)), ppms)} />
      }
    </>
  );
});


export default TransientEvent;