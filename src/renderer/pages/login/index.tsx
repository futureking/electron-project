import React from "react";
import { Button, Input } from 'antd';
import STYLES from './index.less';

const  Login = () => {
  return (
    <div className={STYLES.wrap}>
      <div className={STYLES.left}>
        <ul>
          <li>
            <div className={STYLES.logo}>logo</div>
          </li>
          <li>
            <h4>RichTap Creator Pro Slogan</h4>
          </li>
          <li>
            <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisi cursus elit feli magna gravida.s</span>
          </li>
        </ul>
      </div>
      <div className={STYLES.right}>
        <ul>
          <li>
            <h4>Create an account</h4>
            <span>Sign up to continue</span>
          </li>
          <li>
            <label>NAME</label>
            <Input placeholder="please input your name~" />
          </li>
          <li>
            <label>EMAIL</label>
            <Input placeholder="please input your EMAIL~" />
          </li>
          <li>
            <label>PASSWORd</label>
            <Input.Password placeholder="please input your PASSWORD~" />
          </li>
          <li>
            <Button type="primary" size="large" block>Create an account</Button>
          </li>
          <li>
            <Button size="large" block>Aready have an account? Login</Button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Login;
