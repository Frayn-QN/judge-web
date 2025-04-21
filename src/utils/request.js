import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
  validateStatus: function (status) {
    // 允许 200-499 的状态码进入 response 拦截器
    return status >= 200 && status < 500;
  },
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    // console.log(config);
    if (config.method === "post" || config.method === "POST") {
      config.headers["Content-Type"] = "application/json;charset=utf-8";
    }

    if (store.getters.token) {
      // let each request carry token
      config.headers.Authorization = "Bearer " + getToken();
      //   console.log(config.headers["Authorization"]);
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data;
    // console.log(res);

    // if the custom code is not 200, it is judged as an error.
    if (res.code !== 200) {
      Message({
        message: res.msg || "Error",
        type: "error",
        duration: 5 * 1000,
      });

      // 401 no token
      if (res.code === 401) {
        // to re-login
        MessageBox.confirm(
          "您的登录已经过期，可选择取消以留在此页面（无法进行操作），或重新登录。",
          "认证问题",
          {
            confirmButtonText: "重新登录",
            cancelButtonText: "取消",
            type: "warning",
          }
        ).then(() => {
          store.dispatch("user/resetToken").then(() => {
            location.reload();
          });
        });
      }
      // return Promise.reject(new Error(res.message || 'Error'))
      return Promise.reject(res);
    } else {
      return res;
    }
  },
  (error) => {
    console.log("err:" + error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
