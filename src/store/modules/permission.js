import { asyncRoutes, constantRoutes } from '@/router'
const state = {
  routes: []
}
const mutations = {
  // 只能写同步任务
  setRoutes (state, payload) {
    state.routes = payload
  }
}
const actions = {
  // 同步异步都可
  filter (context, menus) {
    const newRoutes = asyncRoutes.filter(item => menus.includes(item.meta.name))
    context.commit('setRoutes', [...constantRoutes, ...newRoutes])
    return newRoutes
    // 返回到外面
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
