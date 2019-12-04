import axios from "axios";
import { MessageBox, Message } from "element-ui";
import store from "@/store";
import { getToken } from "@/utils/auth";

// axios文档： http://www.axios-js.com/zh-cn/docs/#axios-request-config
// create an axios instance
const service = axios.create({
  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  baseURL: process.env.VUE_APP_BASE_API,
  // 指定请求超时的毫秒数(0 表示无超时时间)，超时请求将被中断
  timeout: 5000
});

// 拦截器 ：then 或 catch 处理前拦截它们。
// request interceptor
service.interceptors.request.use(
  config => {
    // 求情头中加入 token
    if (store.getters.token) {
      config.headers["token"] = getToken();
    }
    return config;
  },
  error => {
    console.log(error);
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data;
    console.log("res", res);

    // 请求异常
    if (res.code !== 200) {
      // token过期，引导到登录界面
      if (res.code === 403) {
        // to re-login
        MessageBox.confirm(
          "You have been logged out, you can cancel to stay on this page, or log in again",
          "Confirm logout",
          {
            confirmButtonText: "Re-Login",
            cancelButtonText: "Cancel",
            type: "warning"
          }
        ).then(() => {
          store.dispatch("user/resetToken").then(() => {
            location.reload();
          });
        });
      } else {
        Message({
          message: res.msg || "Error",
          type: "error",
          duration: 5 * 1000
        });
      }
      return Promise.reject(new Error(res.msg || "Error"));
    } else {
      return res;
    }
  },
  error => {
    console.log("err" + error); // for debug
    Message({
      message: error.msg,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default service;
