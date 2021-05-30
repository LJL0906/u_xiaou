import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
import { actions } from "./actions"
import { state, mutations, getters } from "./mutations"
import cate from "./modules/cate"
import specs from "./modules/specs"
import member from "./modules/member"
import shop from "./modules/shop"
import banner from "./modules/banner"
import seckill from "./modules/seckill"
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
    cate,
    specs,
    member,
    shop,
    banner,
    seckill
  }
})
