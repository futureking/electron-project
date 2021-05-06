import transient from './transient';
import continues from './continous';



const cellSchemaMap: { [key: string]: any } = {
  'node-transient': transient,
  'node-continues': continues
};

export default cellSchemaMap;
