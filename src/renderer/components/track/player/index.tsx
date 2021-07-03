import { useEffect, useRef } from 'react';
import WaveSurfer from "wavesurfer.js";
import { LOAD_AUDIO } from '@/../share/define/message';
import store from '@/stores';
import { isUndefined } from 'lodash';
import { observer } from 'mobx-react-lite';
import style from './index.less';

const { ipcRenderer } = window;

export let wavesurfer;



const PlayerTrack = observer(() => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      wavesurfer = WaveSurfer.create({
        container: ref.current,
        waveColor: 'violet',
        progressColor: 'purple',
        height: ref.current.clientHeight
      });
    }
  }, []);
  const audio = store.audioPath;
  useEffect(() => {
    if (!isUndefined(audio) && audio !== '') {
      ipcRenderer.invoke(LOAD_AUDIO, audio)
        .then(res => {
          if (!isUndefined(res)) {
            const blob = new Blob([res.buffer], { type: "audio/wav" });
            // console.log(blob);
            // console.log(wavesurfer)
            if (!isUndefined(wavesurfer)) {
              wavesurfer.loadBlob(blob);
              // wavesurfer.on('ready', function () {
              //   wavesurfer.play();
              // });
            }
          }
        });
    }
  }, [audio]);

  // const play = () => {
  //   if (isUndefined(wavesurfer)) return;
  //   wavesurfer.play();
  // }
  // const pause = () => {
  //   if (isUndefined(wavesurfer)) return;
  //   wavesurfer.pause();
  // }
  // const stop = () => {
  //   if (isUndefined(wavesurfer)) return;
  //   if (wavesurfer.isPlaying())
  //     wavesurfer.stop();
  // }
  return (
    <div className={style.player} ref={ref} hidden/>
  );
});

export default PlayerTrack;