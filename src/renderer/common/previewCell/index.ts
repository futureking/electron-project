import transient from './transient';
import continues from './continous';
import group from './group';
import AtoV from './AtoV';
import Repeat from './repeat';
import Curve from './curve';
import Background from './backgroundMusic';
import { LIST_LIB } from '@/../share/define/message';
import LibItem from './library';
const { ipcRenderer } = window;


const cellMap: { [key: string]: any } = {
  'node-transient': transient,
  'node-continues': continues,
  'node-group': group,
  'node-AtoV': AtoV,
  'node-repeat': Repeat,
  'node-curve': Curve,
  'node-background': Background
};

ipcRenderer.invoke(LIST_LIB).then(libs => {
  libs.map(name => {
      cellMap[name] = LibItem;
  })
})
export default cellMap;
