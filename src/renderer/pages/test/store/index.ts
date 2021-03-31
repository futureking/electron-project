import React, { useState } from 'react';

export const Context = React.createContext({});

export interface InitState {
  root: any;
  setData: Function
}

export const ContextProvider = ({ children }: any) => {
  // 修改状态
  const setData = (name: string, data: any) => {
    setState(prevState => {
      return { ...prevState, [name]: data };
    });
  };

  // 添加新的状态
  const addStore = (name: string, initState: any) => {
    setState(prevState => ({ ...prevState, [name]: initState }));
  };

  const initAppState: InitState = {
    root: { text: 'hello context', list: ['1+1=?', '1+2=?'] },
    setData,
    addStore,
  };
  const [state, setState] = useState(initAppState);

  return <Context.Provider value={state}>{children}</Context.Provider>;
};