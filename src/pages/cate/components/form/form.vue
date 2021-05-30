<template>
  <div>
    <!-- close：el-dialog关闭的回调函数 -->
    <!--5.:visible.sync="info.isshow"对应el-dialog 显示隐藏弹框 所以绑定info的isshow-->
    <!--6.用组件绘制输入框的页面 -->
    <el-dialog :title="info.isAdd?'分类添加':'分类编辑'" :visible.sync="info.isshow" @close="close">
      <el-form :model="form">
        <el-form-item label="上级分类" :label-width="formLabelWidth">
          <el-select v-model="form.pid">
            <el-option label="请选择" value disabled></el-option>
            <el-option label="顶级分类" :value="0"></el-option>
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.catename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :before-upload="updateImg"
          >
            <img v-if="imgUrl" :src="imgUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
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
import { reqcateedit, reqcateinfo, reqcateadd } from "../../../../request/api";
import { successAlert, errorAlert } from "../../../../utils/alert";
import path from "path";
export default {
  /*4.from组件通过props接受info */
  props: ["info", "editInfo"],
  data() {
    return {
      /* 7. 需要传给后端的数据也是输入框内容的数据*/
      form: {
        pid: "",
        catename: "",
        img: null,
        status: 1,
      },
      formLabelWidth: "120px",
      imgUrl: "",
    };
  },
  mounted() {
    /* 一加载form组件就请求菜单列表 通过自定义事件触发父组件的请求菜单列表的方法 */
    this.getcatelist();
  },
  computed: {
    ...mapGetters({
      cateList: "cate/cateList",
    }),
  },
  methods: {
    ...mapActions({
      getcatelist: "cate/getChangeList",
    }),

    // 上传图片
    updateImg(file) {
      //判断文件的上传大小
      if (file.size > 2 * 1024 * 1024) {
        errorAlert("文件不能超过2m");
        return;
      }
      //判断是不是图片
      let extnameArr = [".jpeg", ".jpg", ".png", ".gif", ".svg"];
      let extname = path.extname(file.name);
      if (!extnameArr.find((item) => item == extname)) {
        errorAlert("只能上传图片");
        return;
      }
      this.imgUrl = URL.createObjectURL(file);
      this.form.img = file;
    },
    //清空
    empty() {
      this.form = {
        pid: "",
        catename: "",
        img: null,
        status: 1,
      };
      this.imgUrl = "";
    },
    //触发添加事件
    addMenu() {
      console.log(this.form);
      /* 发送请求 */
      reqcateadd(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert("添加成功");
          // 添加成功后清空输入框的内容
          this.empty();
          //弹框消失
          this.info.isshow = false;
          //list请求数据重新渲染
          this.getcatelist();
        }
      });
    },
    //触发编辑事件
    sureEdit() {
      /* 发起请求 */
      reqcateedit(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert("修改成功");
          /* 成功后清空输入框内容，调用empty方法 */
          this.empty();
          /* 弹框消失 */
          this.info.isshow = false;
          //list请求数据重新渲染
          this.getcatelist();
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
      reqcateinfo({ id }).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list ? res.data.list : this.form;
          this.form.id = id;
          this.imgUrl = this.$pre + this.form.img;
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
/deep/ .avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>