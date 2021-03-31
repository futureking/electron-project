import { Link } from 'umi';
import Login from './login';
import Test from './tests';

export default function Index() {
  return (
    <div style={{ textAlign: 'center' }}>
      
      <Link to='/settings'>
        <h1>Yay! Welcome to Electron Pro!</h1>
      </Link>
      <br />
      <Test />
    </div>
  );
}
