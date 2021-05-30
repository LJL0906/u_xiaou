import Vue from "vue"
import axios from "axios"
import qs from "qs"
import { errorAlert } from "../utils/alert"
import store from '../store/index'
import router from "../router/index"
//判断开发和生产环境
if (process.env.NODE_ENV == "development") {
  Vue.prototype.$pre = "http://localhost:3000"
}
if (process.env.NODE_ENV == "production") {
  Vue.prototype.$pre = ""
}

//请求拦截
axios.interceptors.request.use(config => {
  if (config.url !== "/api/login") {
    config.headers.authorization = store.state.user.token;
  }
  return config;
})

//响应拦截
axios.interceptors.response.use(res => {
  console.log("请求地址" + res.config.url);
  console.log(res);
  if (res.data.code != 200) {
    errorAlert(res.data.msg)
  }
  //统一处理掉线
  if (res.data.msg == "登录已过期或访问权限受限") {
    router.push("/login")
  }
  return res;
})


//get
export const get = (url, params = {}) => {
  return new Promise((reslove, reject) => {
    axios.get(url, {
      params
    }).then(res => {
      reslove(res)
    })
  })
}
//post
export const post = (url, params, isFile = false) => {
  let data = null;
  if (isFile) {
    data = new FormData()
    for (let i in params) {
      data.append(i, params[i])
    }
  } else {
    data = qs.stringify(params)
  }
  return new Promise((resolve, reject) => {
    axios.post(url, data).then(res => {
      resolve(res)
    })
  })
}