import { observer } from "mobx-react-lite";

import { InputNumber } from 'antd';
import styles from './index.less';
import { TimeType } from "@/models";

interface TimeFormatProps {
    min: number;
    sec: number;
    msec: number;
    disabled: boolean;
    change: Function;
}

const TimeFormat = observer((props: TimeFormatProps) => {
    const { min, sec, msec, disabled, change } = props;
    return (
        <div className={styles.time}>
            <InputNumber value={min} className={styles.format} disabled={disabled}
                onBlur={(event) => {
                    const str = (event.target as HTMLInputElement).value;
                    if (str === '')
                        return;
                    change(parseInt(str, 10), TimeType.Min);
                }}
                onPressEnter={(event) => {
                    const str = (event.target as HTMLInputElement).value;
                    if (str === '')
                        return;
                    change(parseInt(str, 10), TimeType.Min);
                }}
                onStep={(value) => change(value, TimeType.Min)}
            />
            <div className={styles.sep}>m</div>
            <InputNumber
                value={sec} className={styles.format} disabled={disabled}
                onBlur={(event) => {
                    const str = (event.target as HTMLInputElement).value;
                    if (str === '')
                        return;
                    change(parseInt(str, 10), TimeType.Sec);
                }}
                onPressEnter={(event) => {
                    const str = (event.target as HTMLInputElement).value;
                    if (str === '')
                        return;
                    change(parseInt(str, 10), TimeType.Sec);
                }}
                onStep={(value) => change(value, TimeType.Sec)}
            />
            <div className={styles.sep}>s</div>
            <InputNumber
                value={msec} className={styles.format} disabled={disabled}
                onBlur={(event) => {
                    const str = (event.target as HTMLInputElement).value;
                    if (str === '')
                        return;
                    change(parseInt(str, 10), TimeType.MSec);
                }}
                onPressEnter={(event) => {
                    const str = (event.target as HTMLInputElement).value;
                    if (str === '')
                        return;
                    change(parseInt(str, 10), TimeType.MSec);
                }}
                onStep={(value) => change(value, TimeType.MSec)}
            />
            <div className={styles.sep}>ms</div>
        </div>
    );
});

export default TimeFormat;