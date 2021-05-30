export const actions = {
  changeUser({ commit }, user) {
    commit("changeUSer", user);
    if (user.token) {
      sessionStorage.setItem("user", JSON.stringify(user))
    } else {
      sessionStorage.removeItem("user")
    }
  }

}