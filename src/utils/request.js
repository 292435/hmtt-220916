import ajax from 'axios'
const axios = ajax.create({
  baseURL: 'http://api-toutiao-web.itheima.net'
})
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
