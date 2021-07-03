// https://umijs.org/config/
import { defineConfig, IConfig } from 'umi';

import routes from './routes';

export default defineConfig({
  antd: {
    dark: true,
    config: {
    }
  },
  theme: {
    "primary-color": "#2BBED1",
  },
  dva: {},
  history: {
    type: 'hash',
  },
  title: 'RichTap Creator Pro',
  // 开发环境通过 http 服务器分发资源，开启 dynamicImport
  // 生产环境直接读取内部文件，几乎不存在延迟，无需开启
  dynamicImport:
    process.env.NODE_ENV === 'development'
      ? {
        loading: '@/components/pageloading',
      }
      : false,
  // umi routes: https://umijs.org/docs/routing
  routes,
  publicPath: './',
  outputPath: `../../dist/renderer`,
} as IConfig);
