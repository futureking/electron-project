import transient from './transient';
import continues from './continous';
import group from './group';
import AtoV from './AtoV';
import background from './background';
import curve from './curve';
import repeat from './repeat';


const baseCellSchemaMap: { [key: string]: any } = {
  'node-transient': transient,
  'node-continues': continues,
  'node-group': group,
  'node-AtoV': AtoV,
  'node-background': background,
  'node-curve': curve,
  'node-repeat': repeat
};

export { baseCellSchemaMap, transient, continues, group, AtoV };
