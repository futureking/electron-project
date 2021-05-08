/**
 * 网络请求配置
 */
 import axios from "axios";
 import { isUndefined } from 'lodash';
 import { message } from 'antd';

 axios.defaults.timeout = 100000;
 axios.defaults.baseURL = "http://test.mediastack.cn/";
 
 /**
  * http request 拦截器
  */
 axios.interceptors.request.use(
   (config) => {
     config.data = JSON.stringify(config.data);
     config.headers = {
       "Content-Type": "application/json",
     };
     return config;
   },
   (error) => {
     return Promise.reject(error);
   }
 );
 
 /**
  * http response 拦截器
  */
 axios.interceptors.response.use(
   (response) => {
     if (response.data.errCode === 2) {
       console.log("过期");
     }
     return response;
   },
   (error) => {
     console.log("请求出错：", error);
   }
 );
 
 /**
  * 封装get方法
  * @param url  请求url
  * @param params  请求参数
  * @returns {Promise}
  */
 export function get<T>(url, params = {}) {
   return new Promise<T>((resolve: any, reject: any) => {
     axios.get(url, {
         params: params,
       }).then((response) => {
         landing(url, params, response.data);
         resolve(response.data);
       })
       .catch((error) => {
         reject(error);
       });
   });
 }
 
 /**
  * 封装post请求
  * @param url
  * @param data
  * @returns {Promise}
  */
 
 export function post<T>(url, data) {
   return new Promise<T>((resolve: any, reject: any) => {
     axios.post(url, data).then(
       (response) => {
        //关闭进度条
        if(!isUndefined(response)) {
          resolve (response.data);
        }else {
          message.error('网络开小差，请稍后重试');
          reject ('网络开小差，请稍后重试');
        }
        //  resolve(response.data);
       },
       (err) => {
         reject(err);
       }
     );
   });
 }
 
 /**
  * 封装patch请求
  * @param url
  * @param data
  * @returns {Promise}
  */
 export function patch<T>(url, data = {}) {
   return new Promise<T>((resolve: any, reject: any) => {
     axios.patch(url, data).then(
       (response) => {
        if(!isUndefined(response)) {
          resolve (response.data);
        }else {
          message.error('网络开小差，请稍后重试');
          reject ('网络开小差，请稍后重试');
        }
       },
       (err) => {
         msag(err);
         reject(err);
       }
     );
   });
 }
 
 /**
  * 封装put请求
  * @param url
  * @param data
  * @returns {Promise}
  */
 
 export function put<T>(url, data = {}) {
   return new Promise<T>((resolve, reject) => {
     axios.put(url, data).then(
       (response) => {
        if(!isUndefined(response)) {
          resolve (response.data);
        }else {
          message.error('网络开小差，请稍后重试');
          reject ('网络开小差，请稍后重试');
        }
       },
       (err) => {
         msag(err);
         reject(err);
       }
     );
   });
 }
 
 //统一接口处理，返回数据
 export default function<T> (fecth, url, param) {
  //  let _data = "";
   return new Promise<T>((resolve: any, reject: any) => {
     switch (fecth) {
       case "get":
         console.log("begin a get request,and url:", url);
         get(url, param)
           .then(function (response: any) {
            if(!isUndefined(response)) {
              resolve (response);
            }else {
              reject ('网络开小差，请稍后重试');
            }
           })
           .catch(function (error) {
             console.log("get request GET failed.", error);
             reject(error);
           });
         break;
       case "post":
         post(url, param)
           .then(function (response: any) {
            if(!isUndefined(response)) {
              resolve (response);
            }else {
              reject ('网络开小差，请稍后重试');
            }
           })
           .catch(function (error) {
             console.log("get request POST failed.", error);
             reject(error);
           });
         break;
       default:
         break;
     }
   });
 }
 
 //失败提示
 function msag(err) {
   if (err && err.response) {
     switch (err.response.status) {
       case 400:
        message.error(err.response.data.error.details);
        break;
       case 401:
        message.error("未授权，请登录");
        break;
 
       case 403:
        message.error("拒绝访问");
        break;
 
       case 404:
        message.error("请求地址出错");
        break;
 
       case 408:
        message.error("请求超时");
        break;
 
       case 500:
        message.error("服务器内部错误");
        break;
 
       case 501:
        message.error("服务未实现");
        break;
 
       case 502:
        message.error("网关错误");
        break;
 
       case 503:
        message.error("服务不可用");
        break;
 
       case 504:
        message.error("网关超时");
        break;
 
       case 505:
        message.error("HTTP版本不受支持");
        break;
       default:
     }
   }
 }
 
 /**
  * 查看返回的数据
  * @param url
  * @param params
  * @param data
  */
 function landing(url, params, data) {
   if (data.code === -1) {
   }
 }