import { IRoute } from 'umi';

const Routes: IRoute[] = [
  {
    path: '/',
    component: '../layout/TransitionLayout',
    routes: [
      {
        path: '/',
        component: './index',
      },
      {
        path: '/login',
        component: './login',
      },
      {
        path: '/dashboard',
        component: './dashboard',
      },
      {
        path: '/mainPage',
        component: './mainPage',
      },
      {
        path: '/main',
        component: './main',
      }
    ],
  },
];

export default Routes;
