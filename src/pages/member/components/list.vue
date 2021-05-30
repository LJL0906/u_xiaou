<template>
  <div>
    <el-table :data="memberList" border style="width: 100%">
      <el-table-column prop="id" label="用户编号" width="180"></el-table-column>
      <el-table-column prop="nickname" label="昵称" width="180"></el-table-column>
      <el-table-column prop="phone" label="手机号"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scoped">
          <el-button type="primary" v-if="scoped.row.status==1">启用</el-button>
          <el-button type="info" v-else>未启用</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scoped">
          <el-button type="primary" @click="toEdit(scoped.row.uid)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: [""],
  data() {
    return {};
  },
  mounted() {
    this.getmemberList();
  },
  computed: {
    ...mapGetters({
      memberList: "member/memberList",
    }),
  },
  methods: {
    ...mapActions({
      getmemberList: "member/getmemberList",
    }),
    toEdit(uid) {
      this.$emit("toEdit", uid);
    },
  },
};
</script>
<style	scoped	lang="less">
@import "../../../less/index.less";
</style>