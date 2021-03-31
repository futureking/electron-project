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
        path: '/settings',
        component: './Settings',
      },
      {
        path: '/dashboard',
        component: './dashboard',
      },
    ],
  },
];

export default Routes;
