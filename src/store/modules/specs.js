import { reqspecslist, reqspecscount } from "../../request/api"

const state = {
  specsList: [],
  total: null,
  page: 1,
  size: 2
}
const mutations = {
  changeList(state, arr) {
    state.specsList = arr
  },
  changeTotal(state, num) {
    state.total = num
  },
  changePage(state, num) {
    state.page = num;
  }
}
const actions = {
  getspecsList({ commit, dispatch, state: { size, page }, }, isAll = false) {
    let p = isAll ? {} : { size, page }
    reqspecslist(p).then(res => {
      let list = res.data.list ? res.data.list : []
      if (list.length == 0 && page !== 1) {
        commit("changePage", page - 1)
        dispatch("getspecsList")
        return;
      }
      commit("changeList", list)
    })
  },
  getspecsTotal({ commit }) {
    reqspecscount().then(res => {
      commit("changeTotal", res.data.list[0].total)
    })
  },
  getspecsPage({ commit, dispatch }, page) {
    commit("changePage", page);
    dispatch("getspecsList")
  }
}
const getters = {
  specsList(state) {
    return state.specsList
  },
  specsTotal(state) {
    return state.total
  },
  specsSize(state) {
    return state.size
  }
}
export default {
  state,
  mutations,
  actions,
  getters,
  namespaced: true
}