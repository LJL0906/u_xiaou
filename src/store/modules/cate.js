import { reqcatelist } from "../../request/api"

const state = {
  cateList: []
}
const mutations = {
  changerList(state, arr) {
    state.cateList = arr
  }
}
const actions = {
  getChangeList({ commit }) {
    reqcatelist({ istree: true }).then(res => {
      commit("changerList",res.data.list)
    })
  }
}
const getters = {
  cateList(state) {
    return state.cateList;
  }
}
export default {
  state,
  mutations,
  actions,
  getters,
  namespaced: true //命名空间
}