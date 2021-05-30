<template>
  <div>
    <!-- 将menuList菜单列表渲染到表格中 -->
    <el-table
      :data="specsList"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="id" label="规格编号" sortable width="120px"></el-table-column>
      <el-table-column prop="specsname" label="规格名称" sortable></el-table-column>
      <el-table-column prop label="规格属性" sortable>
        <template slot-scope="scoped">
          <el-tag v-for="(item,index) in scoped.row.attrs" :key="index">{{item}}</el-tag>
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

    <!-- 分页 -->
    <el-pagination
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      @current-change="getspecsPage"
    ></el-pagination>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { reqspecsdelete } from "../../../../request/api";
import { successAlert } from "../../../../utils/alert";
export default {
  /* 通过props接受父组件传过来的menuList菜单列表 */
  props: [""],
  data() {
    return {};
  },
  mounted() {
    this.getspecsList();
    this.getspecsTotal();
  },
  computed: {
    ...mapGetters({
      specsList: "specs/specsList",
      total: "specs/specsTotal",
      size: "specs/specsSize",
    }),
  },
  methods: {
    ...mapActions({
      getspecsList: "specs/getspecsList",
      getspecsTotal: "specs/getspecsTotal",
      getspecsPage: "specs/getspecsPage",
    }),
    // 当表格中点击编辑之后 通过触发自定义事件edit传到父组件 将当前这一行的id传过去
    listEdit(id) {
      this.$emit("edit", id);
    },
    //删除 发起请求
    del(id) {
      reqspecsdelete({ id }).then((res) => {
        if (res.data.code == 200) {
          successAlert("删除成功");
          this.getspecsList();
          this.getspecsTotal();
        }
      });
    },
  },
};
</script>
<style	scoped	lang="less">
@import "../../../../less/index.less";
</style>