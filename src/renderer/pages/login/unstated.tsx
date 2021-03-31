import { createContainer } from "unstated-next";
import { useState, useEffect, useCallback } from "react";

function useCounter() {
  const [count, setCount] = useState(0);

  const decrement = () => {
    setCount(count - 1)
  };
  const increment = useCallback(() => {
    setCount(count + 1)
  }, [count]);

  const handleKeyDown = useCallback(
    (event) => {
      console.log("current count", count);
      setCount(count + 1);
    },
    [count]
  );

  useEffect(() => {
    console.log("count", count);
  }, [count]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return { count, decrement, increment };
}

export default createContainer(useCounter);