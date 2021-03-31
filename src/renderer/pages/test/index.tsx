import React from "react";
import Test from './components/test1';
import { ContextProvider } from './store';
const  Login: React.FC = () => {

  return (
    <ContextProvider className="wrap">
      <Test />
    </ContextProvider>
  );
}

export default Login;
