import ajax from 'axios'
// import { Notify } from 'vant'
import { getToken, removeToken } from '@/utils/token.js' // setToken
// import { newTokenAPI } from '@/api'
import router from '@/router'
const axios = ajax.create({
  // baseURL: 'http://geek.itheima.net'
  baseURL: 'https://toutiao.itheima.net'
})
// 添加请求拦截器
axios.interceptors.request.use(
  function (config) {
    if (getToken()?.length > 0 && config.headers.Authorization === undefined) {
      // 在发送请求之前做些什么
      config.headers.Authorization = `Bearer ${getToken()}`
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    return response
  },
  async function (error) {
    if (error.response?.status === 401) {
      // Notify({ type: 'success', message: '身份过期' })
      removeToken()
      // const res = await newTokenAPI()
      // console.log('res', res)
      // setToken(res.data.data.token)
      // error.config.headers.Authorization = `Bearer ${res.data.data.token}`
      // console.log(error)
      // return axios(error.config)

      router.replace(`/login?path=${router.currentRoute.fullPath}`)
    }
    // else if (
    //   error.response.status == 500 &&
    //   error.response.config.url === '/v1_0/authorizations' &&
    //   error.response.config.method === 'put'
    // ) {
    //   Notify({ type: 'warning', message: '身份过期' })
    //   router.replace('/login')
    // }
    // 对响应错误做点什么
    return Promise.reject(error)
  }
)
export default ({
  url,
  method = 'GET',
  params = {},
  data = {},
  headers = {}
}) => {
  return axios({
    url,
    method,
    params,
    data,
    headers
  })
}
