import { reqmemberlist } from "../../request/api"

const state = {
  memberList: []
}
const mutations = {
  changeList(state, arr) {
    state.memberList = arr
  }
}
const actions = {
  getmemberList({ commit }) {
    reqmemberlist({ size: 20, page: 1 }).then(res => {
      if (res.data.code == 200) {
        let list = res.data.list ? res.data.list : [];

        commit("changeList", list)
      }
    })
  },
}
const getters = {
  memberList(state) {
    return state.memberList
  }
}
export default {
  state,
  mutations,
  actions,
  getters,
  namespaced: true
}