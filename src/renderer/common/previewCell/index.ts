import transient from './transient';
import continues from './continous';

const cellMap: { [key: string]: any } = {
  'node-transient': transient,
  'node-continues': continues
};

export default cellMap;
