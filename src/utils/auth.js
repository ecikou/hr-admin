import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken () {
  return Cookies.get(TokenKey)
}

export function setToken (token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken () {
  return Cookies.remove(TokenKey)
}

// 数据持久化 寸时间戳
const TimeKey = 'heima_time_key'
export function setTime (time) {
  return Cookies.set(TimeKey, time)
}
// 取时间戳
export function getTime () {
  return Cookies.get(TimeKey)
}
