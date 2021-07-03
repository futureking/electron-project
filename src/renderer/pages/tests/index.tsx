import React from "react";
import Comps from './components'
import { setProvider } from './store';

const  Tests: React.FC = () => {
  // const [STORE, dispatch]: any = useStore();
  return (
    <div className="wrap">
      <Comps />
    </div>
  );
}

export default setProvider(Tests);
