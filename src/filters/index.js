import Vue from "vue"
let filters = {

}
for (let i in filters) {
  Vue.filter(i,filters[i])
}