<template>
  <div class="mask">
    <div class="con">
      <h3>登录</h3>
      <p>
        <el-input v-model="user.username" clearable></el-input>
      </p>
      <p>
        <el-input v-model="user.password" show-password clearable></el-input>
      </p>
      <p class="button">
        <el-button type="primary" @click="login">登录</el-button>
      </p>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { requserlogin } from "../../request/api";
import { errorAlert, successAlert } from "../../utils/alert";
export default {
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
    };
  },
  mounted() {},
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      changeUser: "changeUser",
    }),
    login() {
      if (this.user.username == 0 && this.user.password == 0) {
        errorAlert("账号密码不能为空");
        return;
      }
      requserlogin(this.user).then((res) => {
        if (res.data.code == 200) {
          successAlert("登录成功");
          this.changeUser(res.data.list);
          this.$router.push("/index");
        }
      });
    },
  },
};
</script>
<style	scoped	lang="less">
@import "../../less/index.less";
.mask {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: linear-gradient(to right, @primary, @primary2);
}
.mask .con {
  width: 400px;
  padding: 40px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  border-radius: 20px;
}
.mask .con p {
  margin-bottom: 20px;
}
h3,
.button {
  text-align: center;
  margin-bottom: 20px;
}
</style>