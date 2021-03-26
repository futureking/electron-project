import { Link } from 'umi';
import Login from './login';

import STYLES from './index.less';

export default function Index() {
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Yay! Welcome to Electron Pro!</h1>
      <br />
      <Login />
      <Link to='/settings'>
        <img className={STYLES.image} src={require('../assets/yay.jpg')} width='400' />
      </Link>
    </div>
  );
}
