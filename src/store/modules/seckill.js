import { reqsecklist } from "../../request/api"

const state = {
  seckillList: []
}
const mutations = {
  changeList(state, arr) {
    state.seckillList = arr
  }
}
const actions = {
  getSeckIllList({ commit }) {
    reqsecklist().then(res => {
      if(res.data.code==200){
        commit("changeList",res.data.list)
      }
    })
  }
}
const getters = {
  seckillList(state) {
    return state.seckillList
  }
}
export default {
  state,
  mutations,
  actions,
  getters,
  namespaced: true
}