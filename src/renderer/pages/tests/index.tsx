import React from "react";
import Comps from './components'
import { setProvider, useStore } from './store';

const  Tests: React.FC = () => {
  const [STORE, dispatch] = useStore();
  console.info(STORE, dispatch);
  return (
    <div className="wrap">
      <Comps />
    </div>
  );
}

export default setProvider(Tests);
