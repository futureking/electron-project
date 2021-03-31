import React from "react";
import CounterContainer from "./unstated";

function Counter() {
  const counter = CounterContainer.useContainer();
  const { count, decrement, increment } = counter;
  return (
    <div>
      <button onClick={decrement}>-</button>
      <p>You clicked {count} times</p>
      <button onClick={increment}>+</button>
    </div>
  );
}

export default Counter;
