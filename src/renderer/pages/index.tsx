import { Link } from 'umi';
import Test from './tests';
import STYLES from './index.less';

export default function Index() {
  return (
    <div className={STYLES.wrap}>
      <Link to='/dashboard'>
        <h1>Yay! Welcome to Electron Pro!</h1>
      </Link>
      <br />
      <Test />
    </div>
  );
}
