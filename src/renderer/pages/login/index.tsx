import React from "react";
import { Link } from 'umi';
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
            <h4>Welcome</h4>
            <span>Sign in to continue</span>
          </li>
          <li>
            <label>USERNAME</label>
            <Input placeholder="please input your name~" />
          </li>
          <li>
            <label>PASSWORd</label>
            <Input.Password placeholder="please input your PASSWORD~" />
          </li>
          <li>
            <Link to="/mainPage"><Button type="primary" size="large" block>Sign in</Button></Link>
          </li>
          <li>
            <Button size="large" block>Create an account</Button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Login;
