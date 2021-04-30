import { useState } from "react";
import { HapticsTrack } from "./haptics-track";
import TimeTrack from "./time-track";

import style from './track.less';

export function Track() {
  const [total] = useState(1*60*1000);
  return (
    <div>
    <div className={style.track}>
      <div style={{height:80, width:total, backgroundColor:'red'}}></div>
      <HapticsTrack ppms={1} total={total} factor={1} height={196} />
      <TimeTrack ppms={1} total={total} factor={1}/>
    </div>
    </div>
  );
};
