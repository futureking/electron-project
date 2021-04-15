import { useState } from "react";
import style from "./time-track.less"

interface TimeTrackProps {
  ppms: number;
  factor: number;
  total: number;
}

const HEIGHT = 36;
const MAIN = 6;
const SUB = 4;
const XOFFSET = 16;

function TimeTrack(props: TimeTrackProps) {
  const { ppms, factor, total } = props;
  const [divider, setDivider] = useState(1000);
  const path = (i:number) => {
      let x = i * ppms * factor + XOFFSET;
      return "M" + x + ", 0V"+ MAIN;
  }

  const subPath = (i:number) => {
      let ret = "";
      let x = i * ppms * factor + XOFFSET;
      for(let j = 1; j < 10; j++) {
          let subX = x + j * divider/10 * ppms * factor;
          ret += "M" + subX + ",0V"+SUB;
      }
      return ret;
  }

  const timeFormat = (i:number) => {
    let min = Math.floor(i / 60000);
    let sec = Math.floor((i % 60000) / 1000 )
    let msec = i % 1000;
    return min.toString().padStart(2,'0') + ':' + sec.toString().padStart(2,'0') +',' + msec.toString().padStart(3,'0')
  }

  const group : Array<any> = [];

  for (let i = 0; i < total; i+=divider) {
      group.push(
          <g key={i}>
              <path d={path(i)} stroke="white" strokeWidth="2"></path>
              <path d={subPath(i)} stroke="white" strokeWidth="1"></path>
              <text x={i * ppms * factor + XOFFSET} y={16} className={style.text}>{timeFormat(i)}</text>
          </g>
      )
  }
  return (
      <svg width={ppms * factor * total + XOFFSET * 2} height={HEIGHT} className={style.time} >
          {group}
          <path d={path(total)} stroke="black" strokeWidth="2"/>
      </svg>
  );
}

export default TimeTrack;
