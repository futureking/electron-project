import { observer } from "mobx-react-lite";

import { InputNumber, Slider } from 'antd';
import styles from './index.less';
import { useUndoGroup } from "@/utils/groupUndo";
import store from "@/stores";

interface InputFormatProps {
  min: number;
  max: number;
  value: number;
  disabled: boolean;
  step?: number;
  change: Function;
  storeFlag?: boolean;
}

const InputFormat = observer((props: InputFormatProps) => {
  const { min, max, value, disabled, change, step, storeFlag=true } = props;
  const groupChange = useUndoGroup(store.current!.id, (value) => change(value));
  return (
    <div className={styles.input}>
      <Slider
        min={min}
        max={max}
        value={value}
        step={step}
        className={styles.slider}
        disabled={disabled}
        // onChange={(value) => groupChange.start(value)}
        onChange={(value) => storeFlag ? groupChange.start(value) : change(value)}
        onAfterChange={groupChange.stop}
      />
      <InputNumber
        min={min}
        max={max}
        className={styles.num}
        value={value}
        step={step}
        disabled={disabled}
        onBlur={(event) => { 
          const str = (event.target as HTMLInputElement).value;
          if(str === '')
            return;
          change(parseInt(str, 10));
        }}
        onPressEnter={(event) =>  { 
          const str = (event.target as HTMLInputElement).value;
          if(str === '')
            return;
          change(parseInt(str, 10));
        }}
        onStep={(value) => change(value)}
      />
    </div>
  );
});

export default InputFormat;
