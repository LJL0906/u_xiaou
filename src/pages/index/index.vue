<template>
  <div>
    <el-container class="container">
      <el-aside width="200px">
        <!-- 导航菜单 -->
        <el-menu
          class="el-menu-vertical-demo"
          :background-color="$aside"
          text-color="#fff"
          active-text-color="#ffd04b"
          :unique-opened="true"
          :router="true"
        >
          <el-menu-item index="/index/home">
            <i class="el-icon-menu"></i>
            <span slot="title">首页</span>
          </el-menu-item>

          <div v-for="item in user.menus" :key="item.id">
            <el-menu-item v-if="!item.children" :index="'/index/'+item.url">{{item.title}}</el-menu-item>
            <el-submenu :index="item.id+''" v-else>
              <template slot="title">
                <i :class="item.icon"></i>
                <span>{{item.title}}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  v-for="con in item.children"
                  :key="con.id"
                  :index="'/index/'+con.url"
                >{{con.title}}</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </div>
        </el-menu>
      </el-aside>
      <!-- 头部和内容 -->
      <el-container>
        <el-header>
          <div>
            用户名：{{user.username}}
            <el-button type="primary" @click="logout">退出</el-button>
          </div>
        </el-header>
        <el-main>
          <!-- 面包屑导航 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/index/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="$route.meta.title">{{$route.meta.title}}</el-breadcrumb-item>
          </el-breadcrumb>
          <!-- 二级路由出口 -->
          <router-view class="view"></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: [""],
  data() {
    return {};
  },
  mounted() {},
  computed: {
    ...mapGetters({
      user: "user",
    }),
  },
  methods: {
    ...mapActions({
      changeUser: "changeUser",
    }),
    logout() {
      this.changeUser({});
      this.$router.replace("/login");
    },
  },
};
</script>
<style	scoped	lang="less">
@import "../../less/index.less";
.container {
  height: 100vh;
}
.el-aside {
  background-color: @aside;
}
.el-header {
  background-color: @header;
}
.el-header h1 {
  margin-top: 15px;
}
.view {
  margin-top: 20px;
}
/deep/ .el-menu-vertical-demo {
  width: 100%;
}
.el-menu-item:focus,
.el-menu-item:hover {
  background-color: @header !important;
}
</style>