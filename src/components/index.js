import Vue from "vue"
import delBtn from "./delBtn.vue"
let components = {
  delBtn
}
for (let i in components) {
  Vue.component(i, components[i])
}