import React, { useState } from "react";
import { history } from 'umi';
import { isNull, isUndefined } from 'lodash';
import { Button, Input, message } from 'antd';
import { queryLogin } from '@/services/login';
import STYLES from './index.less';

interface responseType {
  code: number,
  message: string,
  result: object,
  success: boolean,
  timestamp: number,
  [key:string]: any
}

const checkStr = (str:string) => {
  if(isNull(str) || isUndefined(str) || str==='') {
    return true;
  }else {
    return false;
  }
}

const  Login: React.FC = () => {
  const [userName, setUserName] = useState<string>('');
  const [userPwd, setUserPwd] = useState<string>('');


  const onQuery = () => {
    const queryData = {userName, userPwd};
    if(checkStr(userName)){
      message.info('请输入用户名')
    }else if(checkStr(userPwd)) {
      message.info('请输入密码')
    }else {
      queryLogin<any>(queryData).then((res: responseType) => {
        if(res.code === 200) {
          history.push('/dashboard');
        }else {
          message.error(res.message);
        }
      });
    }
  }

  return (
    <div className={STYLES.wrap}>
      <div className={STYLES.left}>
        <ul>
          <li>
            <div className={STYLES.logo}>
              <img src={require('./imgs/logo.svg')} alt="" />
            </div>
          </li>
          <li>
            <h4>RichTap Creator Pro</h4>
          </li>
          <li>
            <span className={STYLES.label}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nisi cursus elit feli magna gravida.s
            </span>
          </li>
        </ul>
      </div>
      <div className={STYLES.right}>
        <ul>
          <li>
            <h4>Welcome</h4>
            <span className={STYLES.label}>Sign in to continue</span>
          </li>
          <li>
            <label>USERNAME</label>
            <Input 
              placeholder="please input your name" 
              value={userName} 
              onChange= {e => setUserName(e.target.value) } 
            />
          </li>
          <li>
            <label>PASSWORD</label>
            <Input.Password 
              placeholder="please input your password" 
              value={userPwd}
              onChange= {e => setUserPwd(e.target.value) } 
            />
          </li>
          <li>
            <Button 
              type="primary" 
              size="large" 
              block
              onClick={onQuery}
            >Sign in</Button>
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
