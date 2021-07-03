import store, { undoManager } from "@/stores";
import { timeToX, intensToY, timeToWidth, intensToH } from "@/utils/draw-utils";
import { observer } from "mobx-react-lite";
import styles from "./index.less";
import Repeat from "../repeat";
import TransientEvent from "../transient";
import ContinuousEvent from "../continuous";

interface A2VProps {
  id: string;
  ppms: number;
  height: number;
  showInd: boolean;
}

const AudioVibration = observer((props: A2VProps) => {
  const { id, ppms, height, showInd } = props;
  const a = store.current!.a2vs.get(id);

  const x = timeToX(a!.start, ppms);
  const y = intensToY(a!.maxIntensity, height, 32) - 16;
  const w = timeToWidth(a!.duration, ppms);
  const h = intensToH(a!.maxIntensity, height, 32) + 16;
  const repeatE = new Array<any>();
  const elemsE = new Array<any>();
  if (!!a) {
    const repeat = a.repeat.times;
    const interval = a.repeat.interval;
    for (let i = 0; i < repeat; i++) {
      const repeatT = i * a.duration + a.start + interval * i;
      const repeatX = timeToWidth(repeatT, ppms);
      repeatE.push(
        <use key={i + 1} x={repeatX} xlinkHref={`#${id}`} onClick={(event) => {
          if (i !== 0) return;
          store.selection.selectA2V(id);
          store.selector.setStart(a.start);
          store.selector.setEnd(a.endWithRepeat);
          store.selection.setOP('Position', event.nativeEvent.offsetX - x, y + h - event.nativeEvent.offsetY);
        }}
          onDoubleClick={() => {
            const rootid = store.currentTab!.rootid;
            const step = undoManager.get(rootid).undoLevels;
            store.currentTab!.goToA2V(id, a.name, step, a.duration);
            store.selection.selectA2V(id);
            store.selection.setInd('Pointer');
            store.selector.setStart(0);
            store.selector.setEnd(a.duration);
          }} />
      );
    }
    a.events.forEach((value, key) => {
      if (value.relativeTime !== null) {
        elemsE.push(
          value.type === 'Transient'
            ? <TransientEvent key={key} id={key} ppms={ppms} height={height}
              time={value.relativeTime} intensity={value.intensity} frequency={value.frequency} duration={value.duration}
              repeat={value.repeat.times} interval={value.repeat.interval} showRepeatInd={!showInd} />
            : <ContinuousEvent key={key} id={key} ppms={ppms} height={height}
              time={value.relativeTime} intensity={value.intensity} frequency={value.frequency} duration={value.duration}
              repeat={value.repeat.times} interval={value.repeat.interval}
              curve={value.curve.toJSON()} showRepeatInd={true} />
        )
      }
    });
  }
  const focused = store.focusA2V && store.focusA2V.id === id;
  return (
    <>
      <defs>
        <g id={id} key={id} type='A2V' >
          {elemsE}
          {
            showInd &&
            <>
              <rect y={y} width={w} height={h}
                rx={4} ry={4}
                fillOpacity={0}
                stroke={focused ? 'white' : '#9EC1E3'}
                strokeWidth={1}
              />
              <text x={w - 2} y={y + 8} dominantBaseline='middle' textAnchor='end' fill='#9EC1E3' fontSize='8px' className={styles.text}>
                A2V
              </text>
            </>
          }
        </g>
      </defs>
      {repeatE}
      {
        a && a.repeateditable && a.repeat.times > 1 &&
        <Repeat id={id} type="A2V" x={x} w={timeToWidth((a!.duration * a.repeat.times + a.repeat.interval * (a.repeat.times - 1)), ppms)} />
      }
    </>
  );
});

export default AudioVibration;