import React, { useReducer, useContext } from 'react';
import { initState, reducer } from './reducer';
const RootContext = React.createContext(initState);
const setProvider = ( Component : any) => ( props :any) => {
  const value: any = useReducer(reducer, initState);
  return (
    <RootContext.Provider value={value}>
      <Component {...props} />
    </RootContext.Provider>
  );
};

const useStore = () => {
  return useContext(RootContext);
};
export { setProvider, useStore };