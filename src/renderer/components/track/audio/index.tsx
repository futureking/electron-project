import store from "@/stores";
import { xToTime } from "@/utils/draw-utils";
import style from "./index.less";
import { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import { isUndefined } from "lodash";

interface AudioTrackProps {
  ppms: number;//pixel per mircoSecond
  left: number;
  width: number;
}

const HEIGHT = 72;

const AudioTrack = observer((props: AudioTrackProps) => {
  const { ppms, left, width } = props;
  const height = (v: number) => {
    return HEIGHT / 256 * (v - (-128));
  }

  const ref = useRef<HTMLCanvasElement>(null);
  let audio = store.audio;
  // console.log("audio", audio);

  const rate = audio!.rate;
  const samples = Math.round(audio!.samples);
  const start = xToTime(left, ppms) * (rate / 1000);
  const duration = width / ppms * (rate / 1000);
  useEffect(() => {
    if (ref.current) {
      const ctx = ref.current!.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, HEIGHT);

        ctx.fillStyle = '#25292E';
        ctx.fillRect(0, 0, width, HEIGHT);
        // let grd = ctx.createLinearGradient(0, 0, durationInPixel, HEIGHT);
        // grd.addColorStop(0, "#29B3D7");
        // grd.addColorStop(1, "#DADE94");
        ctx.strokeStyle = '#DADE94';
        ctx.beginPath();
        ctx.moveTo(0, 36);
        if (start < samples) {
          for (let i = 0; i < duration; i++) {
            if (start + i < samples) {
              const x = (i) / (rate / 1000) * ppms;
              const y = height(audio!.data[start + i]);
              ctx.lineTo(x, y);
            }
            else {
              ctx.lineTo(width, 36);
              break;
            }
          }
        }
        else {
          ctx.strokeStyle = '#FF9C6E';
          ctx.lineTo(width, 36);
        }
        ctx.stroke();
      }
    }
  }, [left, width, ppms, audio])


  return (
    !isUndefined(audio)?
    <canvas ref={ref} width={width} height={HEIGHT} className={style.audio} onMouseDown={() => store.selection.selectBG()} />
    :<div/>
  );
});

export default AudioTrack;
