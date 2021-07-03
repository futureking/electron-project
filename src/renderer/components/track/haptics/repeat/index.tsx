import store from "@/stores";
import { observer } from "mobx-react-lite";

interface RepeatProps {
  id: string;
  type: 'Event' | 'Group' | 'A2V';
  x: number;
  w: number;
}

const Repeat = observer((props: RepeatProps) => {
  const { id, type, x, w } = props;
  return (
    <g id={id} key={id} onMouseDown={() => store.selection.selectRepeat(type, id)}>
      <line x1={x} y1={8} x2={x + w / 2 - 10} y2={8} stroke="white" />
      <image href={require('@/assets/images/repeat.png')} x={x + w / 2 - 8} y={0} height={16} width={16} />
      <line x1={x + w / 2 + 10} y1={8} x2={x + w} y2={8} stroke="white" />
    </g>
  );
});

export default Repeat;