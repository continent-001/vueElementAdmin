import axios from 'axios'
import { MessageBox } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // baseURL
  timeout: 56789 // 超时时间
})

service.interceptors.request.use(config => { // 请求拦截器
  if (store.getters.token) {
    config.headers.Authorization = 'Bearer ' + getToken()
  }
  return config
}, error => {
  console.log(error) // 打印错信息
  return Promise.reject(error)
})

service.interceptors.response.use(response => { // 响应拦截器
  const { data: res } = response
  return res
}, error => {
  if (error.message.includes('401')) {
    MessageBox.confirm('请重新登录', '登录信息过期', {
      confirmButtonText: '重新登录',
      closeOnClickModal: false,
      showCancelButton: false,
      showClose: false,
      type: 'warning'
    }).then(() => {
      store.dispatch('user/logout').then(() => {
        location.reload()
      })
    })
  }
  return Promise.reject(error)
})

export default service
