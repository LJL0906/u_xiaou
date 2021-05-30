import { reqgoodslist, reqgoodscount } from "../../request/api"

const state = {
  cateList: [],
  page: 1,
  size: 2,
  total: 0
}
const mutations = {
  changeList(state, arr) {
    state.cateList = arr
  },
  changePage(state, num) {
    state.page = num
  },
  changeTotal(state, total) {
    state.total = total
  }
}
const actions = {
  reqList({ commit, dispatch, state: { size, page } }) {
    reqgoodslist({ page, size }).then(res => {
      let list = res.data.list ? res.data.list : []
      // 如果取到的数据没有，而且还不是第一页，那么就请求上一页
      if (list.length == 0 && page !== 1) {
        commit("changePage", page - 1)
        dispatch("reqList");
        return;
      }
      commit("changeList", list)
    })
  },
  //请求total
  reqTotal({ commit }) {
    reqgoodscount().then(res => {
      commit("changeTotal", res.data.list[0].total)
    })
  },
  //组件触发修改page
  changePage({ dispatch, commit }, num) {
    // 修改页码
    commit("changePage", num);
    //重新请求列表
    dispatch("reqList")
  }
}
const getters = {
  cateList(state) {
    return state.cateList;
  },
  size(state) {
    return state.size;
  },
  page(state) {
    return state.page;
  },
  total(state) {
    return state.total;
  }
}
export default {
  state,
  mutations,
  actions,
  getters,
  namespaced: true //命名空间
}