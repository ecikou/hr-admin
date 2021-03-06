import { login } from '@/api/user'
const state = {
  token: ''
}
const mutations = {
  setToken (state, palay) {
    state.token = palay
  }
}
const actions = {
  async login (context, data) {
    try {
      const res = await login(data)
      context.commit('setToken', res.data.data)
      console.log(res)
    } catch (err) {
      console.log(err)
    }
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}

