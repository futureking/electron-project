import { timeToX } from "@/utils/draw-utils";
import { timeAtMin, timeAtSec, timeAtMSec } from "@/utils/utils";
import { useState } from "react";
import style from "./index.less"

interface TimeTrackProps {
  ppms: number;
  total: number;
}

const HEIGHT = 36;


function TimeTrack(props: TimeTrackProps) {
  const { ppms, total } = props;
  const [divider] = useState(1000);
  const subD = divider / 10;
  const elem = new Array<any>();
  const repeatE = new Array<any>();

  const timeFormat = (i:number) => {
    let min = timeAtMin(i);
    let sec = timeAtSec(i);
    let msec = timeAtMSec(i);
    return min.toString().padStart(2,'0') + ':' + sec.toString().padStart(2,'0') +',' + msec.toString().padStart(3,'0')
  }

  for (let i = 0; i < total; i = i + divider) {
    const repeatX = timeToX(i, ppms);
    repeatE.push(
      <use key={i} x={repeatX} xlinkHref={'#main'} />
    );
    for (let j = 1; j < 10; j++) {
      const sub = timeToX(i + j * subD, ppms);
      repeatE.push(
        <use key={`${i}-${j}`} x={sub} xlinkHref={'#sub'} />
      );
    }
    elem.push(
      <text key={i} x={i * ppms} y={23} className={style.text}>{timeFormat(i)}</text>
    );
  }

  return (
    <svg width={ppms * total} height={HEIGHT} className={style.time} >
      <defs>
        <line id='main' x1={0} y1={0} x2={0} y2={6} stroke="white" />
      </defs>
      <defs>
        <line id='sub' x1={0} y1={0} x2={0} y2={4} stroke="white" />
      </defs>
      {repeatE}
      {elem}
      <use x={total*ppms} xlinkHref={'#main'} />
    </svg>
  );
}
export default TimeTrack;