import { IRoute } from 'umi';

const Routes: IRoute[] = [
  {
    path: '/',
    component: '../layout/TransitionLayout',
    // path: '/login',
    // component: '../pages/login',
    routes: [
      {
        path: '/login',
        component: './login',
      },
      {
        path: '/',
        component: './index',
      },
      {
        path: '/dashboard',
        component: './dashboard',
      },
      {
        path: '/main',
        component: './main',
      }
    ],
  },
];

export default Routes;
