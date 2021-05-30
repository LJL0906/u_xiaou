<template>
  <div>
    <!-- close：el-dialog关闭的回调函数 -->
    <!--5.:visible.sync="info.isshow"对应el-dialog 显示隐藏弹框 所以绑定info的isshow-->
    <!--6.用组件绘制输入框的页面 -->
    <el-dialog :title="info.isAdd?'菜单添加':'菜单编辑'" :visible.sync="info.isshow" @close="close">
      <el-form :model="form">
        <!-- 7.form.title -->
        <el-form-item label="菜单名称" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 8.form.pid -->
        <el-form-item label="上级菜单" :label-width="formLabelWidth">
          <el-select v-model="form.pid" @change="changePid">
            <el-option label value="请选择" disabled></el-option>
            <el-option label="顶级菜单" :value="0"></el-option>
            <!-- 请求到菜单menuList遍历到这个选择框里 -->
            <!-- value用form.pid -->
            <el-option v-for="item in menuList" :key="item.id" :label="item.title" :value="item.id"></el-option>
          </el-select>
          <!-- form.type -->
        </el-form-item>
        <el-form-item label="菜单类型" :label-width="formLabelWidth">
          <el-radio v-model="form.type" :label="1" disabled>目录</el-radio>
          <el-radio v-model="form.type" :label="2" disabled>菜单</el-radio>
        </el-form-item>
        <!-- form.icon -->
        <el-form-item label="菜单图标" :label-width="formLabelWidth" v-if="form.type==1">
          <el-select v-model="form.icon">
            <el-option label value="请选择" disabled></el-option>
            <!-- 将下面的icon图标数据遍历在这个菜单图标选择框里 value就是选中后的icon编码-->
            <el-option v-for="item in icons" :key="item" :value="item">
              <!-- 将图标编码通过i标签展示到表格中 -->
              <i :class="item"></i>
            </el-option>
          </el-select>
        </el-form-item>
        <!-- form.url -->
        <el-form-item label="菜单地址" :label-width="formLabelWidth" v-else>
          <el-select v-model="form.url">
            <el-option label value="请选择" disabled></el-option>
            <!-- 遍历二级路由集合，将路由的meta展示到菜单地址选择框中，value就是选中后的url地址 -->
            <el-option
              v-for="item in indexRouter"
              :key="item.path"
              :label="item.meta.title"
              :value="item.path"
              @change="changePid"
            ></el-option>
          </el-select>
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
import { reqMenuadd, reqMenuinfo, reqMenuedit } from "../../../../request/api";
import { indexRouter } from "../../../../router/index";
import { successAlert } from "../../../../utils/alert";
export default {
  /*4.from组件通过props接受info */
  props: ["info", "menuList", "editInfo"],
  data() {
    return {
      /* 7. 需要传给后端的数据也是输入框内容的数据*/
      form: {
        pid: "",
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: 1,
      },
      formLabelWidth: "120px",
      /* icon图标 */
      icons: [
        "el-icon-s-tools",
        "el-icon-s-goods",
        "el-icon-plus",
        "el-icon-minus",
        "el-icon-user-solid",
      ],
      /* 二级路由集合 */
      indexRouter,
    };
  },
  mounted() {
    /* 一加载form组件就请求菜单列表 通过自定义事件触发父组件的请求菜单列表的方法 */
    this.$emit("menu");
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    //清空
    empty() {
      this.form = {
        pid: "",
        title: "",
        icon: "",
        type: 1,
        url: "",
        status: 1,
      };
    },
    //触发添加事件
    addMenu() {
      /* f发送请求 */
      reqMenuadd(this.form).then((res) => {
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
      /* 发起请求  因为我写的form和后端要求的参数一样，并且也补了id字段，所以直接将form传给后端*/
      reqMenuedit(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert("修改成功");
          /* 成功后清空输入框内容，调用empty方法 */
          this.empty();
          /* 弹框消失 */
          this.info.isshow = false;
          //list请求数据重新渲染
          this.$emit("menu");
        }
      });
    },
    //判断是目录还是菜单
    changePid() {
      /* 通过选择上级菜单的pid判断是目录还是菜单，0就是顶级菜单则选择目录，不是0就选择菜单 */
      this.form.type = this.form.pid == 0 ? 1 : 2;
    },
    /* 父组件通过ref触发toEdit事件 
    弹框显示,isAdd设为true，不是添加是编辑
    */
    toEdit(id) {
      this.info.isshow = true;
      this.info.isAdd = false;
      // 查询这条编辑内容
      /* 通过id请求这条数据 */
      reqMenuinfo({ id }).then((res) => {
        if (res.data.code == 200) {
          /* 成功请求后将获取的数据给form,展示到输入框中 */
          this.form = res.data.list ? res.data.list : this.form;
          /* 因为此时form没有id,所以这里补一个id字段，值就是接收的id */
          this.form.id = id;
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