<template>
  <div>
    <!-- close：el-dialog关闭的回调函数 -->
    <!--5.:visible.sync="info.isshow"对应el-dialog 显示隐藏弹框 所以绑定info的isshow-->
    <!--6.用组件绘制输入框的页面 -->

    <el-dialog :title="info.isAdd?'管理员添加':'管理员编辑'" :visible.sync="info.isshow" @close="close">
      <el-form :model="form">
        <!-- 所属角色 -->
        <el-form-item label="所属角色" :label-width="formLabelWidth">
          <el-select v-model="form.roleid" placeholder="请选择">
            <el-option label="请选择" value disabled></el-option>
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 用户名 -->
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password"></el-input>
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
  reqrolelist,
  requserinfo,
  requseredit,
  requseradd,
} from "../../../../request/api";
import { successAlert } from "../../../../utils/alert";
export default {
  /*4.from组件通过props接受info */
  props: ["info", "menuList", "editInfo"],
  data() {
    return {
      /* 7. 需要传给后端的数据也是输入框内容的数据*/
      form: {
        roleid: "",
        username: "",
        password: "",
        status: "",
      },
      formLabelWidth: "120px",
      roleList: [],
    };
  },
  mounted() {
    /* 一加载form组件就请求角色列表 通过自定义事件触发父组件的请求角色列表的方法 */
    reqrolelist({}).then((res) => {
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
        roleid: "",
        username: "",
        password: "",
        status: "",
      };
    },
    //触发添加事件
    addMenu() {
      /* 发送请求 */
      requseradd(this.form).then((res) => {
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
      /* 发起请求 */
      requseredit(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert("修改成功");
          /* 弹框消失 */
          this.info.isshow = false;
          if ((this.form.uid == this.user.uid)) {
            this.changeUser({});
            this.$router.replace("/login");
            return; 
          }
          /* 成功后清空输入框内容，调用empty方法 */
          this.empty();
          //list请求数据重新渲染
          this.$emit("menu");
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
      requserinfo({ uid: id }).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list ? res.data.list : this.form;
          this.form.password = "";
          this.form.uid = id;
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