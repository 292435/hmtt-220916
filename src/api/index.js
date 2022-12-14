import axios from '@/utils/request.js'
import { getStorage } from '@/utils/storage'
// import { getToken } from '@/utils/token'
export const allChannelListAPI = () => {
  return axios({
    url: '/v1_0/channels'
  })
}
export const loginAPI = (obj) => {
  return axios({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: obj
  })
}
export const getUserChannelAPI = () => {
  return axios({
    url: '/v1_0/user/channels'
  })
}
export const getAllArticleAPI = ({ channel_id, timestamp }) => {
  return axios({
    url: '/v1_0/articles',
    params: {
      channel_id,
      timestamp
    }
  })
}
export const dislikeArticleAPI = ({ artId }) => {
  return axios({
    url: '/v1_0/article/dislikes',
    method: 'POST',
    data: {
      target: artId
    }
  })
}
export const reportArticleAPI = ({ id, type }) => {
  return axios({
    url: '/v1_0/article/reports',
    method: 'POST',
    data: {
      target: id,
      type: type,
      remoark: '如果需要的话，判断选中类型是否式其它内容，然后弹出输入框'
    }
  })
}
export const updateUserChannelAPI = (channels) => {
  return axios({
    url: '/v1_0/user/channels',
    method: 'PUT',
    data: {
      channels
    }
  })
}
export const removeTheChannelAPI = (target) => {
  return axios({
    url: `/v1_0/user/channels/${target}`,
    method: 'DELETE'
  })
}
export const suggestionAPI = ({ value }) => {
  return axios({
    url: '/v1_0/suggestion',
    params: {
      q: value
    }
  })
}
export const searchResultAPI = ({ page = 1, per_page = 10, q }) => {
  return axios({
    url: '/v1_0/search',
    params: {
      page,
      per_page,
      q
    }
  })
}
// 获取文章详情
export const detailAPI = ({ article_id }) => {
  return axios({
    url: `/v1_0/articles/${article_id}`
  })
}
export const followingsAPI = ({ id }) => {
  return axios({
    url: '/v1_0/user/followings',
    method: 'POST',
    data: {
      target: id
    }
  })
}
export const unFollowingAPI = ({ target }) => {
  return axios({
    url: `/v1_0/user/followings/${target}`,
    method: 'DELETE'
  })
}
export const likeAPI = ({ target }) => {
  return axios({
    url: '/v1_0/article/likings',
    method: 'POST',
    data: {
      target
    }
  })
}
export const unLikeAPI = ({ target }) => {
  return axios({
    url: `/v1_0/article/likings/${target}`,
    method: 'DELETE'
  })
}
export const commentsAPI = ({ id, offset = null, limit = 10 }) => {
  return axios({
    url: '/v1_0/comments',
    params: {
      type: 'a',
      source: id,
      offset,
      limit
    }
  })
}
export const commentsLikeAPI = ({ com_id }) => {
  return axios({
    url: '/v1_0/comment/likings',
    method: 'POST',
    data: {
      target: com_id
    }
  })
}
export const uncommentsLikeAPI = ({ target }) => {
  return axios({
    url: `/v1_0/comment/likings/${target}`,
    method: 'DELETE'
  })
}
export const setCommentsAPI = ({ target, content, art_id = null }) => {
  const obj = {
    target: target,
    content: content
  }
  if (art_id !== null) {
    obj.art_id = art_id
  }
  return axios({
    url: '/v1_0/comments',
    method: 'POST',
    data: obj
  })
}
// collections收藏文章
export const collectionsAPI = ({ target }) => {
  return axios({
    url: '/v1_0/article/collections',
    method: 'POST',
    data: {
      target
    }
  })
}
// uncollections取消收藏文章
export const unCollectionsAPI = ({ target }) => {
  return axios({
    url: `/v1_0/article/collections/${target}`,
    method: 'DELETE',
    params: {
      target
    }
  })
}
// 获取用户个人信息： /v1_0/user
export const userInfoAPI = () => {
  return axios({
    url: '/v1_0/user'
  })
}
// 获取用户资料
export const profilesAPI = () => {
  return axios({
    url: '/v1_0/user/profile'
  })
}
// 更新用户头像/v1_0/user/photo
export const updatePhotoAPI = (fd) => {
  return axios({
    url: '/v1_0/user/photo',
    method: 'PATCH',
    data: fd
  })
}
// 编辑个人资料 /v1_0/user/profile
export const profileAPI = ({ name, gender, birthday, real_name, intro }) => {
  return axios({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data: { name, gender, birthday, real_name, intro }
  })
}
// 刷新token
export const newTokenAPI = () => {
  return axios({
    url: '/v1_0/authorizations',
    method: 'PUT',
    headers: {
      Authorization: 'Bearer ' + getStorage('refresh_token')
    }
  })
}
