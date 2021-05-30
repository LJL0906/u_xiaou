<template>
  <div>
    <!-- 2.点击 添加按钮 绑定show事件-->
    <el-button type="primary" @click="show">添加</el-button>
    <!-- 绑定edit自定义事件 开始编辑 -->
    <v-list @edit="edit" @del="del"></v-list>

    <!-- 分页 -->
    <el-pagination
      layout="prev, pager, next"
      :total="total"
      :page-size="size"
      @current-change="changePage"
    ></el-pagination>

    <!-- 3.:info="info": 通过自定义属性，父传子，将info传给from -->
    <!-- 将获取到的menuList菜单列表通过自定义属性（父传子）给list渲染到页面 -->
    <!-- ref绑定form组件 -->
    <v-form :info="info" ref="form"></v-form>
  </div>
</template>
<script>
import vList from "./components/list/list";
import vForm from "./components/form/form";
import { mapGetters, mapActions } from "vuex";
import { reqgoodsdelete } from "../../request/api";
import { successAlert } from "../../utils/alert";
export default {
  props: [""],
  data() {
    return {
      /*  
      1.isshow用来显示隐藏from弹框 true是显示，false是隐藏
        isAdd用来判断是否是添加 添加 isAdd就是true 编辑isAdd就是编辑*/
      info: {
        isshow: false,
        isAdd: true,
      },
    };
  },
  components: {
    vList,
    vForm,
  },
  mounted() {
    this.reqList();
    this.reqTotal();
  },
  computed: {
    ...mapGetters({
      page: "shop/page",
      total: "shop/total",
      size: "shop/size",
    }),
  },
  methods: {
    ...mapActions({
      //获取分类列表
      reqList: "shop/reqList",
      //获取总数
      reqTotal: "shop/reqTotal",
      //修改页码
      changePage: "shop/changePage",
    }),
    /* 触发show事件 */
    show() {
      /* isshow和isAdd都为true,弹框出现并且是添加 */
      this.info.isshow = true;
      this.info.isAdd = true;
    },
    /* 触发edit编辑事件，接受id, 在通过ref触发form中的toEdit事件,并且将接受的id穿过去*/
    edit(id) {
      this.$refs.form.toEdit(id);
    },
    //删除 发起请求
    del(id) {
      reqgoodsdelete({ id }).then((res) => {
        if (res.data.code == 200) {
          successAlert("删除成功");
          this.reqList();
          this.reqTotal();
        }
      });
    },
  },
};
</script>
<style	scoped	lang="less">
@import "../../less/index.less";
</style>