<template>
  <div>
    <!-- 2.点击 添加按钮 绑定show事件-->
    <el-button type="primary" @click="show">添加</el-button>
    <!-- 绑定edit自定义事件 开始编辑 -->
    <v-list :menuList="menuList" @edit="edit" @del="del"></v-list>

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
    <v-form :info="info" @menu="menu" :menuList="menuList" ref="form"></v-form>
  </div>
</template>
<script>
import vList from "./components/list/list";
import vForm from "./components/form/form";
import { mapGetters, mapActions } from "vuex";
import { requserlist, requserdelete, requsercount } from "../../request/api";
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
      /* 菜单列表的初始值 */
      menuList: [],
      /* 获取一条菜单的初始值 */
      editInfo: {},
      //目前展示2页
      size: 2,
      page: 1,
      //总数
      total: 0,
    };
  },
  components: {
    vList,
    vForm,
  },
  mounted() {
    /* 一加载页面就开始请求菜单列表 调用请求菜单的方法*/
    this.updateMenu();
    this.count();
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    /* 触发show事件 */
    show() {
      /* isshow和isAdd都为true,弹框出现并且是添加 */
      this.info.isshow = true;
      this.info.isAdd = true;
    },
    //获取管理员总数
    count() {
      requsercount().then((res) => {
        if (res.data.code == 200) {
          this.total = res.data.list[0].total;
        }
      });
    },
    /* 触发edit编辑事件，接受id, 在通过ref触发form中的toEdit事件,并且将接受的id穿过去*/
    edit(id) {
      this.$refs.form.toEdit(id);
    },
    menu() {
      // 同时触发请求管理员列表和重新统计总数
      this.updateUser();
    },
    /* 请求管理员列表的方法 */
    updateMenu() {
      requserlist({ size: this.size, page: this.page }).then((res) => {
        if (res.data.code == 200) {
          let list = res.data.list ? res.data.list : [];
          // 如果这一页没有数据但是也不是第一页
          if (list.length == 0 && this.page != 1) {
            // 当前页数减一
            this.page--;
            //然后重新调用updateMenu，再次获取数据
            this.updateMenu();
            return;
          }
          this.menuList = list;
        }
      });
    },
    //同时触发请求管理员列表和重新统计总数
    updateUser() {
      this.updateMenu();
      this.count();
    },
    //页码改变触发
    changePage(e) {
      this.page = e;
      this.updateMenu();
    },
    //删除 发起请求
    del(id) {
      requserdelete({ uid: id }).then((res) => {
        if (res.data.code == 200) {
          successAlert("删除成功");
          //同时触发请求管理员列表和重新统计总数
          this.updateUser();
        }
      });
    },
  },
};
</script>
<style	scoped	lang="less">
@import "../../less/index.less";
</style>