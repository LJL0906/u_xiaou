import Vue from "vue"
const vm = new Vue()
//成功
export const successAlert = (msg) => {
  vm.$message({
    message: msg,
    type: 'success'
  });
}
//失败
export const errorAlert = (msg) => {
  vm.$message({
    message: msg,
    type: 'warning'
  });
}