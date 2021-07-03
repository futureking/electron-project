import { useState, useRef, useEffect } from "react";
import TimeTrack from "./time";
import AudioTrack from "./audio";
import PlayerTrack from "./player";
import HapticsTrack from "./haptics";
import style from './index.less';
import { observer } from "mobx-react-lite";
import { Select } from 'antd';
import Ratio from "../ratio-selector";
import Scale from "./scale";
import store from "@/stores";

const { Option } = Select;

interface TrackProps {
  total: number;
}
export const Track = observer((props: TrackProps) => {
  const { total } = props;
  const [height] = useState(180 + 16 + 16);
  const [showProps, setShowProps] = useState([true, true]);
  const handleChange = (value) => {
    switch (value) {
      case '0':
        setShowProps([true, true]);
        break;
      case '1':
        setShowProps([true, false]);
        break;
      case '2':
        setShowProps([false, true]);
        break;
    }
  }
  const ratioSquence = [20, 50, 100, 200];
  const [ratio, setRatio] = useState(100);

  const [width, setWidth] = useState(0);
  const [scrolledLeft, setScrolledLeft] = useState(0);
  const [pos, setPos] = useState([0, 0]);
  const ref = useRef<HTMLDivElement>(null);
  const scroll = () => {
    setScrolledLeft(ref.current!.scrollLeft);
  }
  useEffect(() => {
    const resize = () => {
      setWidth(ref.current!.clientWidth);
      const rect = ref.current!.getBoundingClientRect();
      setPos([rect.left, rect.top]);
    }
    window.addEventListener("resize", resize);
    resize();
    return () => {
      window.removeEventListener("resize", resize);
    }
  }, [scrolledLeft, width, store.hasAudio, showProps[0]]);

  useEffect(() => {
    const leftEdge = (scrolledLeft) / ratio * 100;
    const rightEdge = (scrolledLeft + width) / ratio * 100;
    // console.log(`left ${leftEdge}, right ${rightEdge}`);
    if (store.selector.start < leftEdge) {
      const pos = Math.max(0, store.selector.start) * (ratio / 100) - 50;
      ref.current!.scrollTo(pos, 0);
    }
    else if (store.selector.start > rightEdge) {
      const pos = Math.min(store.selector.start, total) * (ratio / 100) - 50;
      ref.current!.scrollTo(pos, 0);
    }
  }, [store.selector.start]);
  useEffect(() => {
    ref.current!.scrollTo(0, 0);
  }, [store.selection.tabid]);

  return (
    <div className={style.view}>
      <div className={style.title}>
        <Select defaultValue="0" style={{ width: 180, }} onChange={handleChange}>
          <Option value="0">Show All</Option>
          <Option value="1">Show Audio Only</Option>
          <Option value="2">Show Haptic Only</Option>
        </Select>
        <PlayerTrack />
        <Ratio data={ratioSquence} ratio={ratio} setRatio={setRatio} />
      </div>
      <div>
        {
          store.hasAudio && showProps[0] &&
          <AudioTrack ppms={ratio / 100} left={scrolledLeft} width={width} />
        }
        <div style={{ display: 'flex' }}>
          {showProps[1] && <Scale height={height} />}
          <div style={{ marginLeft: showProps[1] ? '0px' : '16px', display: 'flex', flexDirection: 'column', overflowX: 'auto' }} ref={ref} onScroll={scroll}>
            {showProps[1] && <HapticsTrack ppms={ratio / 100} total={total} height={height} left={pos[0]} top={pos[1]} scroll={scrolledLeft} />}
            <TimeTrack ppms={ratio / 100} total={total} />
          </div>
        </div>
      </div>
    </div>

  );
});
