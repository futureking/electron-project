import store, { undoManager } from "@/stores";
import { timeToX, intensToY, timeToWidth, intensToH } from "@/utils/draw-utils";
import { observer } from "mobx-react-lite";
import styles from "./index.less";
import Repeat from "../repeat";
import TransientEvent from "../transient";
import ContinuousEvent from "../continuous";

interface GroupProps {
  id: string;
  ppms: number;
  height: number;
  showGroupInd: boolean;
}

const Group = observer((props: GroupProps) => {
  const { id, ppms, height, showGroupInd } = props;
  const g = store.current!.groups.get(id);

  const x = timeToX(g!.start, ppms);
  const y = intensToY(g!.maxIntensity, height, 32) - 16;
  const w = timeToWidth(g!.duration, ppms);
  const h = intensToH(g!.maxIntensity, height, 32) + 16;
  const repeatE = new Array<any>();
  const elemsE = new Array<any>();
  if (!!g) {
    const repeat = g.repeat.times;
    const interval = g.repeat.interval;
    for (let i = 0; i < repeat; i++) {
      const repeatT = i * g.duration + g.start + interval * i;
      const repeatX = timeToWidth(repeatT, ppms);
      repeatE.push(
        <use key={i + 1} x={repeatX} xlinkHref={'#' + id}
          onMouseDown={(event) => {
            if (i !== 0) return;
            store.selection.selectGroup(id);
            store.selector.setStart(g.start);
            store.selector.setEnd(g.endWithRepeat);
            store.selection.setOP('Position', event.nativeEvent.offsetX - x, y + h - event.nativeEvent.offsetY);
          }}
          onDoubleClick={() => {
            const rootid = store.currentTab!.rootid;
            const step = undoManager.get(rootid).undoLevels;
            store.currentTab!.goToGroup(id, g.name, step, g.duration);
            store.selection.selectGroup(id);
            store.selection.setInd('Pointer');
            store.selector.setStart(0);
            store.selector.setEnd(g.duration);
          }} />
      );
    }
    g.events.forEach((value, key) => {
      if (value.relativeTime !== null) {
        elemsE.push(
          value.type === 'Transient'
            ? <TransientEvent key={key} id={key} ppms={ppms} height={height}
              time={value.relativeTime} intensity={value.intensity} frequency={value.frequency} duration={value.duration}
              repeat={value.repeat.times} interval={value.repeat.interval} showRepeatInd={!showGroupInd} />
            : <ContinuousEvent key={key} id={key} ppms={ppms} height={height}
              time={value.relativeTime} intensity={value.intensity} frequency={value.frequency} duration={value.duration}
              repeat={value.repeat.times} interval={value.repeat.interval}
              curve={value.curve.toJSON()} showRepeatInd={true} />
        )
      }
    });
  }
  const focused = store.focusGroup && store.focusGroup.id === id;
  return (
    <>
      <defs>
        <g id={id} key={id} type='Group'>
          {elemsE}
          {
            showGroupInd &&
            <>
              <rect y={y} width={w} height={h}
                rx={4} ry={4}
                fillOpacity={0}
                stroke={focused ? 'white' : '#FBC04D'}
                strokeWidth={1}
              />
              <text x={w - 2} y={y + 8} dominantBaseline='middle' textAnchor='end' fill='#FBC04D' fontSize='8px' className={styles.text}>Group</text>
            </>
          }
        </g>
      </defs>
      {repeatE}
      {
        g && g.repeateditable && g.repeat.times > 1 &&
        <Repeat id={id} type="Group" x={x} w={timeToWidth((g!.duration * g.repeat.times + g.repeat.interval * (g.repeat.times - 1)), ppms)} />
      }
    </>
  );
});

export default Group;