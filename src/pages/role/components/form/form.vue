<template>
  <div>
    <!-- close：el-dialog关闭的回调函数 -->
    <!--5.:visible.sync="info.isshow"对应el-dialog 显示隐藏弹框 所以绑定info的isshow-->
    <!--6.用组件绘制输入框的页面 -->
    <el-dialog :title="info.isAdd?'角色添加':'角色编辑'" :visible.sync="info.isshow" @close="close">
      <el-form :model="form">
        <!-- 7.form.title -->
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="form.rolename" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 树形控件 -->
        <el-form-item label :label-width="formLabelWidth">
          <el-tree
            :data="roleList"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            :props="{children: 'children',label: 'title'}"
          ></el-tree>
        </el-form-item>

        <!-- form.status -->
        <el-form-item label="状态" :label-width="formLabelWidth">
          <!-- :active-value="1" 打开开关的值
          :inactive-value="2" 关闭开关的值-->
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- 绑定事件，事件名为close,方便和ui组件的取消回调函数一起使用 -->
        <el-button @click="close">取 消</el-button>
        <!-- 通过info中的isAdd是否为ture判断是添加还是编辑，条件渲染显示对应按钮 -->
        <!-- 点击添加触发addMenu事件 -->
        <el-button type="primary" @click="addMenu" v-if="info.isAdd">添加</el-button>
        <!-- 点击编辑按钮触发sureEdit事件 -->
        <el-button type="primary" @click="sureEdit" v-else>编辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import {
  reqMenulist,
  reqroleinfo,
  reqroleedit,
  reqroleadd,
} from "../../../../request/api";
import { successAlert } from "../../../../utils/alert";
export default {
  /*4.from组件通过props接受info */
  props: ["info", "menuList", "editInfo"],
  data() {
    return {
      /* 7. 需要传给后端的数据也是输入框内容的数据*/
      form: {
        rolename: "",
        menus: "",
        status: "",
      },
      formLabelWidth: "120px",
      roleList: [],
    };
  },
  mounted() {
    /* 一加载form组件就请求菜单列表 通过自定义事件触发父组件的请求菜单列表的方法 */
    reqMenulist({ istree: true }).then((res) => {
      if (res.data.code == 200) {
        this.roleList = res.data.list;
      }
    });
  },
  computed: {
    ...mapGetters({
      user: "user",
    }),
  },
  methods: {
    ...mapActions({
      changeUser: "changeUser",
    }),
    //清空
    empty() {
      this.form = {
        rolename: "",
        menus: "",
        status: "",
      };
      this.$refs.tree.setCheckedKeys([]);
    },
    //触发添加事件
    addMenu() {
      //获取树形控件选中的id
      //将获取的数组转成字符串格式
      this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      /* 发送请求 */
      reqroleadd(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert("添加成功");
          // 添加成功后清空输入框的内容
          this.empty();
          //弹框消失
          this.info.isshow = false;
          //list请求数据重新渲染
          this.$emit("menu");
        }
      });
    },
    //触发编辑事件
    sureEdit() {
      this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      /* 发起请求 */
      reqroleedit(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert("修改成功");
          /* 弹框消失 */
          this.info.isshow = false;
          if ((this.form.id == this.user.roleid)) {
            this.changeUser({});
            this.$router.replace("/login");
            return;
          }
          //list请求数据重新渲染
          this.$emit("menu");
          /* 成功后清空输入框内容，调用empty方法 */
          this.empty();
        }
      });
    },
    /* 父组件通过ref触发toEdit事件 
    弹框显示,isAdd设为true，不是添加是编辑
    */
    toEdit(id) {
      this.info.isshow = true;
      this.info.isAdd = false;
      // 查询这条编辑内容
      /* 通过id请求这条数据 */
      reqroleinfo({ id }).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list ? res.data.list : this.form;
          this.form.id = id;
          this.$refs.tree.setCheckedKeys(JSON.parse(res.data.list.menus));
        }
      });
    },
    //取消弹框，解决编辑和添加冲突问题
    //将事件定义为close是因为组件有个事件就是close,ui组件取消弹框的回调函数触发
    close() {
      /* 如果不是添加的就清空内容然后弹框消失 */
      !this.info.isAdd && this.empty();
      this.info.isshow = false;
    },
  },
};
</script>
<style	scoped	lang="less">
@import "../../../../less/index.less";
</style>