<template>
  <div>
    <!-- close：el-dialog关闭的回调函数 -->
    <!--5.:visible.sync="info.isshow"对应el-dialog 显示隐藏弹框 所以绑定info的isshow-->
    <!--6.用组件绘制输入框的页面 -->

    <el-dialog :title="info.isAdd?'规格添加':'规格编辑'" :visible.sync="info.isshow" @close="close">
      <el-form :model="form">
        <!-- 规格名称 -->
        <el-form-item label="规格名称" :label-width="formLabelWidth">
          <el-input v-model="form.specsname"></el-input>
        </el-form-item>
        <!-- 规格属性 -->
        <el-form-item label="规格属性" :label-width="formLabelWidth">
          <div class="box" v-for="(item ,index) in specsArr" :key="index">
            <el-input v-model="item.value"></el-input>
            <el-button type="primary" @click="addsSpecs" v-if="index==0">新增规格属性</el-button>
            <el-button type="danger" v-else @click="delSpecs(index)">删除</el-button>
          </div>
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
  reqspecsinfo,
  reqspecsedit,
  reqspecsadd,
} from "../../../../request/api";
import { successAlert } from "../../../../utils/alert";
export default {
  /*4.from组件通过props接受info */
  props: ["info"],
  data() {
    return {
      /* 7. 需要传给后端的数据也是输入框内容的数据*/
      form: {
        specsname: "",
        attrs: "",
        status: "",
      },
      formLabelWidth: "120px",
      specsArr: [{ value: "" }],
    };
  },
  mounted() {},
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      getspecsList: "specs/getspecsList",
      getspecsTotal: "specs/getspecsTotal",
    }),
    //新增规格属性
    addsSpecs() {
      this.specsArr.push({ value: "" });
    },
    //删除规格属性
    delSpecs(index) {
      this.specsArr.splice(index, 1);
    },
    //清空
    empty() {
      this.form = {
        specsname: "",
        attrs: "",
        status: "",
      };
      this.specsArr = [{ value: "" }];
    },
    //触发添加事件
    addMenu() {
      this.form.attrs = this.specsArr.reduce((val, item) => {
        return val + item.value + ",";
      }, "");
      this.form.attrs = this.form.attrs.slice(0, length - 1);
      /* 发送请求 */
      reqspecsadd(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert("添加成功");
          // 添加成功后清空输入框的内容
          this.empty();
          //弹框消失
          this.info.isshow = false;
          //list请求数据重新渲染
          this.getspecsList();
          this.getspecsTotal();
        }
      });
    },
    //触发编辑事件
    sureEdit() {
      this.form.attrs = this.specsArr.map((item) => item.value).join(",");
      /* 发起请求 */
      reqspecsedit(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert("修改成功");
          /* 成功后清空输入框内容，调用empty方法 */
          this.empty();
          /* 弹框消失 */
          this.info.isshow = false;
          //list请求数据重新渲染
          this.getspecsList();
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
      reqspecsinfo({ id }).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list[0] ? res.data.list[0] : this.form;
          this.specsArr = this.form.attrs.map((item) => {
            return {
              value: item,
            };
          });
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
.box {
  display: flex;
  margin-bottom: 20px;
}
.box input {
  flex: 1;
}
</style>