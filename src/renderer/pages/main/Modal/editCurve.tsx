import React, { createContext, useState, useEffect } from 'react';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { Modal, message } from 'antd';
import { Graph } from '@antv/x6';
import CurveChart from './components/CurveChart';
import InputFormat from '@/components/input-format';
import store from '@/stores';
import { xToTime } from "@/utils/draw-utils";
import { yToIntens } from './components/scale-util';
import STYLES from './editCurve.less';

interface IProps {
  flowChart: Graph;
}
interface Curve {
  frequency: number;
  intensity: number;
  time: number;
  hover: boolean;
}
interface PointType {
  x: number,
  y: number
}

interface IStore {
  curveData: Array<Curve>,
  focus: number,
  setFocus: Function,
  setInit: Function,
  changeRelative: Function,
  changIntensity: Function,
  changFrequency: Function,
  onChangeData: Function,
  changePic: Function,
  onDelCurvePoint: Function
}

export const Context = createContext<IStore|null>(null);

const EditCurve: React.FC<IProps> = observer((props) => {
  const { flowChart } = props;
  let event, duration, ppms, frequency, intensity;
  if(store.focusEvent && store.focusEvent!.type==='Continuous') {
    event = store.focusEvent;
    duration = store.focusEvent!.duration || 0;
    ppms = 700 / duration;
    frequency = store.focusEvent!.frequency || 0;
    intensity = store.focusEvent!.intensity || 0;
  }
  const [visible, setVisible] = useState<boolean>(false);
  const [id, setId] = useState<string>('');
  const [curveList, setCurveList] = useState<Array<Curve>>();

  const storeContext:IStore = useLocalObservable(() => ({
    curveData: Array<Curve>(),
    focus: 0,
    setFocus(data: number) {
      this.focus = data;
    },
    changePic() {
      this.curveData.map(item => item.hover = false);
      this.curveData[this.focus].hover = true;
    },
    setInit(data: Array<Curve>) {
      this.curveData = [];
      data.map(item => {
        this.curveData.push(item);
      })
    },
    changeRelative(focus: number, v: number) {
      let value = v < 0 ? 0 : v;
      this.curveData[this.focus].time = value;
    },
    changIntensity(focus: number, v: number) {
      let value = v < 0 ? 0 : (v > 1 ? 1 : v);
      this.curveData[this.focus].intensity = value;
    },
    changFrequency(focus: number, v: number) {
      let value = v < -100 ? v : (v > 100 ? 100 : v);
      this.curveData[this.focus].frequency = value;
    },
    onChangeData(newH: number, newD: number) {
      let realD = (this.focus >1 && newD< this.curveData[this.focus-1].time) ? this.curveData[this.focus-1].time : (this.focus < this.curveData.length -1 && newD > this.curveData[this.focus+1].time) ? this.curveData[this.focus+1].time : newD ;
      this.curveData[this.focus].intensity = newH;
      this.curveData[this.focus].time = realD;
    },
    onDelCurvePoint() {
      if(this.curveData.length <=4) {
        message.info('The current number of Curve points has reached the minimum (4)')
      }else {
        let newData = this.curveData.filter((item, index) => {
          return index != this.focus;
        })
        this.setInit(newData);
      }
    }
  }));

  useEffect(() => {
    onInit();
  }, [JSON.stringify(store.focusEvent) || JSON.stringify(store.focusGroup) || JSON.stringify(store.focusA2V)])


  const handler = (data) => {
    setId(data.cell.id);
    setVisible(true);
    store.selection.setIsEditCurve(true);
  };

  const onCancel = () => {
    store.selection.setIsEditCurve(false);
    onInit();
    setVisible(false);
  };

  const onInit = () => {
    const newlist = new Array<Curve>();
    if (!!event && !!(event.curve)) {
      event.curve!.map(item => {
        newlist.push({
          ...item,
          hover: false
        })
      })
      setCurveList(newlist);
      storeContext.setInit(newlist);
    }
  }

  // life
  useEffect(() => {
    flowChart.on('graph:showCurveModal', handler);
    return () => {
      flowChart.off('graph:showCurveModal', handler);
    };
  }, [JSON.stringify(store.focusEvent)]);


  const onConfirm = () => {
      const newList = storeContext.curveData.map(item => {
        const {hover, ...res} = item
        return{
          ...res
        }
      });
      event.editCurve(newList);
      const ratioArr = newList.map(item => item.time/duration);
      event.setCurveRatio(ratioArr);
      onCancel();
  }
  
  const changeFocus = (data) => {
    // setFocus(data);
    storeContext.setFocus(data);
    storeContext.changePic();
  }

  const onAddPoint = (point:PointType) => {
    if(storeContext.curveData && storeContext.curveData.length > 15) {
      message.info('The current number of Curve points has reached the maximum (16)');
    }else {
      const time = xToTime(point.x + 10, ppms);
      const intensity = yToIntens(point.y - 25, 350);
      if(time > 0 && time < storeContext.curveData[storeContext.curveData.length -1].time) {  
        const data = storeContext.curveData!.concat({
          time, 
          intensity, 
          frequency: 0, 
          hover: false
        }).sort(compare());
        setCurveList(data);
        const index = data.findIndex(item => item.time === time);
        storeContext.setInit(data);
        storeContext.setFocus(index);
        storeContext.changePic();
      }
    }
  }

  function compare () {
    return function(a,b){
        return a.time - b.time;
    }
  }

  return (
    <div className={STYLES.wrap}>
      <Context.Provider value={storeContext}>
        {!!curveList && 
          <Modal
            className={STYLES.wrap}
            width={1070}
            visible={visible}
            okText="Import"
            footer={null}
            onCancel={onCancel}
            maskClosable={false}
          >
            <div className={STYLES.content}>
              <div className={STYLES.chart}>
                <CurveChart
                  id={id}
                  time={700}
                  changeFocus={changeFocus}
                  duration={duration}
                  frequency={frequency}
                  intensity={intensity}
                  ppms={ppms}
                  onAddPoint={onAddPoint}
                />
              </div>
              <div className={STYLES.edit}>
                <h3>Curve</h3>
                <p>focus: {storeContext.focus+1}</p>
                <ul>
                  <li>
                    <p>Relative Time</p>
                    <InputFormat
                      min={storeContext.focus >0 && storeContext.focus < storeContext.curveData.length - 1 ? storeContext.curveData[storeContext.focus-1].time + 1 : 0 }
                      max={storeContext.focus >0 && storeContext.focus === storeContext.curveData.length - 1 ? duration : storeContext.curveData[storeContext.focus+1] && storeContext.curveData[storeContext.focus+1].time-1 }
                      value={storeContext.curveData && storeContext.curveData.length > 0 ? storeContext.curveData[storeContext.focus] && storeContext.curveData[storeContext.focus].time : 0}
                      disabled={storeContext.focus === 0 || storeContext.focus === storeContext.curveData.length - 1 ? true : false}
                      storeFlag={false}
                      change={value => storeContext.changeRelative(focus, value)}
                    />
                  </li>
                  <li>
                    <p>Intensity</p>
                    <InputFormat
                      min={0}
                      max={1}
                      step={0.01}
                      storeFlag={false}
                      value={storeContext.curveData && storeContext.curveData.length > 0 ? storeContext.curveData[storeContext.focus] && storeContext.curveData[storeContext.focus].intensity : 0}
                      disabled={storeContext.focus === 0 || storeContext.focus === storeContext.curveData.length - 1 ? true : false}
                      change={value => storeContext.changIntensity(focus, value)}
                    />
                  </li>
                  <li>
                    <p>Frequency</p>
                    <InputFormat
                      min={-100}
                      max={100}
                      storeFlag={false}
                      value={storeContext.curveData && storeContext.curveData.length > 0 ? storeContext.curveData[storeContext.focus] && storeContext.curveData[storeContext.focus].frequency : 0}
                      disabled={false}
                      change={value => storeContext.changFrequency(focus, value)}
                    />
                  </li>
                </ul>
                <footer>
                  <div className={STYLES.resetBtn} onClick={onInit}>Reset</div>
                  <div className={STYLES.confirmBtn} onClick={onConfirm}>Confirm</div>
                </footer>
              </div>
            </div>
          </Modal>
        }
      </Context.Provider>
    </div>
  )
})

export default EditCurve;