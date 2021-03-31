import React, { useEffect } from "react";
import { useStore } from '../store';

const  Comps: React.FC = () => {
  const [STORE, dispatch] = useStore();
  
  console.info(STORE);

  useEffect(() => {
    dispatch({type: 'SET_STAFF_LIST', payload: '123'})
  }, [])

  return (
    <div className="wrap">
      {STORE.staff_list}
    </div>
  );
}

export default Comps;