import { useState } from 'react'
import { observer } from "mobx-react-lite";
import { Button } from 'antd';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import style from "./index.less"

interface RatioProps {
    data: Array<number>;
    ratio: number;
    setRatio: Function;
}

const Ratio = observer((props: RatioProps) => {
    const { data, ratio, setRatio } = props;
    const [index, setIndex] = useState(data.findIndex(i => i === ratio));
    const zoomOut = () => {
        if(index === 0)
            return;
        setRatio(data[index-1]);
        setIndex(index-1);
    }
    const zoomIn = () => {
        if(index === data.length-1)
            return;
        setRatio(data[index+1]);
        setIndex(index+1);
    }

    return (
        <div className={style.ratio}>
            <Button size="small" type="link" icon={<MinusOutlined />} onClick={zoomOut}/>
            <div className={style.dis}>{`${data[index]}%`}</div>
            <Button size="small" type="link"  icon={<PlusOutlined />} onClick={zoomIn}/>
        </div>
    );
})

export default Ratio;