import { timeToX } from "@/utils/draw-utils";
// import { timeAtMin, timeAtSec, timeAtMSec } from "@/utils/utils";
import { useState } from "react";
import STYLES from "./index.less"

const HEIGHT = 36;

interface IProps {
  duration: number
}

function TimeTrack(props: IProps) {
  const { duration } = props;
  const ppms = 1;
  const total = 700;
  const [divider] = useState(700);
  //刻度线频率
  const subD = divider / 10;
  //刻度值频率
  const subW = duration / 10;
  //绘制刻度
  const elem = new Array<any>();
  //绘制刻度线
  const repeatE = new Array<any>();

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

    for( let z=0; z<=10; z++) {
      elem.push(
        <text key={z} x={z * subD} y={23} className={STYLES.text}>{Math.floor(Number(subW * z))}</text>
      );
    }
  }

  return (
    <div className={STYLES.time}>
      <svg width={ppms * total} height={HEIGHT} >
        <defs>
          <line id='main' x1={0} y1={0} x2={0} y2={6} stroke="white" />
        </defs>
        <defs>
          <line id='sub' x1={0} y1={0} x2={0} y2={4} stroke="white" />
        </defs>
        {repeatE}
        {elem}
        <use x={Number(total*ppms)} xlinkHref={'#main'} />
      </svg>
    </div>
  );
}
export default TimeTrack;