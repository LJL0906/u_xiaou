import { reqbannerlist } from "../../request/api";

const state = {
  bannerList: []
}
const mutations = {
  changeList(state, arr) {
    state.bannerList = arr;
  }
}
const actions = {
  reqBannerList({ commit }) {
    reqbannerlist().then(res => {
      commit("changeList",res.data.list)
    })
  }
}
const getters = {
  bannerList(state) {
    return state.bannerList;
  }
}
export default {
  state,
  mutations,
  actions,
  getters,
  namespaced: true
}