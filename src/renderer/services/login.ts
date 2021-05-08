import http from '@/utils/ajax';


// interface responseType {
//   code: number,
//   message: string,
//   result: object,
//   success: boolean,
//   timestamp: number,
//   [key:string]: any
// }

/**
 * 获取首页列表
 */
function queryLogin<T>(data){
  return new Promise<T>((resolve, reject) => {
    http<T>("post",'http://10.178.43.68:8080/richtap/auth/appLogin', data).then((res) => {
      resolve(res);
    } , error => {
      console.log(error);
      reject(error)
    })
  }) 
}

export {
  queryLogin
}