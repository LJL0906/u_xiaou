<template>
  <div>
    <div>
      <!-- 将menuList菜单列表渲染到表格中 -->
      <el-table
        :data="cateList"
        style="width: 100%;margin-bottom: 20px;"
        row-key="id"
        border
        default-expand-all
        :tree-props="{children: 'children'}"
      >
        <el-table-column prop="id" label="分类编号" sortable width="120px"></el-table-column>
        <el-table-column prop="catename" label="分类名称" sortable></el-table-column>
        <el-table-column prop label="图片" sortable>
          <template slot-scope="scoped">
            <img :src="$pre+scoped.row.img" alt />
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scoped">
            <!-- 通过传过来的status，判断是启用了还是没启用，条件渲染 -->
            <el-button type="primary" v-if="scoped.row.status==1">启用</el-button>
            <el-button type="info" v-else>未启用</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="button" label="操作">
          <template slot-scope="scoped">
            <!-- 点击编辑触发listEdit事件，将这一行的id传过去 -->
            <el-button type="primary" @click="listEdit(scoped.row.id)">编辑</el-button>
            <!-- <el-button type="danger" @click="del(scoped.row.id)">删除</el-button> -->
            <!-- 这是封装后的删除按钮组件，点击删除触发del事件，将id传过去 -->
            <del-btn @delAlert="del(scoped.row.id)"></del-btn>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
      cateList: "cate/cateList",
    }),
  },
  methods: {
    ...mapActions({}),
    // 当表格中点击编辑之后 通过触发自定义事件edit传到父组件 将当前这一行的id传过去
    listEdit(id) {
      this.$emit("edit", id);
    },
    //点击删除后将id传给封装后的del删除组件，那边处理
    del(id) {
      this.$emit("del", id);
    },
  },
};
</script>
<style	scoped	lang="less">
@import "../../../../less/index.less";
img {
  width: 80px;
  height: 80px;
}
</style>