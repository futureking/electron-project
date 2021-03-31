import React from "react";
import CounterContainer from "./unstated";
import Counter from "./component";


const  Login = () => {
  return (
    <div className="App">
      <CounterContainer.Provider>
        <Counter />
        <Counter />
      </CounterContainer.Provider>
    </div>
  );
}

export default Login;
