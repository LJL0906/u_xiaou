export const state = {
  user: sessionStorage.getItem("user") ? JSON.parse(sessionStorage.getItem("user")) : {}
}
export const mutations = {
  changeUSer(state, user) {
    state.user = user
  }
}
export const getters = {
  user(state) {
    return state.user
  }
}