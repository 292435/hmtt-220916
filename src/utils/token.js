const key = 'geek-token'
export const setToken = (token) => {
  return localStorage.setItem(key, token)
}
export const getToken = () => {
  return localStorage.getItem(key)
}
export const removeToken = () => {
  return localStorage.removeItem(key)
}
