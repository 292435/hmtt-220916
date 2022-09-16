import axios from '@/utils/request.js'
export const allChannelListAPI = () => {
  return axios({
    url: '/mp/v1_0/channels'
  })
}
export const loginAPI = ({ mobile, code }) => {
  return axios({
    url: '/mp/v1_0/authorizations',
    method: 'POST',
    data: { mobile, code }
  })
}
