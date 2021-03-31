import React, { useState, useEffect, useContext } from "react";
import { Context } from '../store';

const  Login: React.FC = () => {

  let { root }: any = useContext(Context);
  console.info(root);
  return (
    <div className="wrap">
      {root}
    </div>
  );
}

export default Login;
