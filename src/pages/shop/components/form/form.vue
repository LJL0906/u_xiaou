<template>
  <div>
    <!-- close：el-dialog关闭的回调函数 -->
    <!--5.:visible.sync="info.isshow"对应el-dialog 显示隐藏弹框 所以绑定info的isshow-->
    <!--6.用组件绘制输入框的页面 -->

    <el-dialog :title="info.isAdd?'商品添加':'商品编辑'" :visible.sync="info.isshow" @close="close">
      <el-form :model="form">
        <!-- 一级分类 -->
        <el-form-item label="一级分类" :label-width="formLabelWidth">
          <el-select v-model="form.first_cateid" placeholder="请选择" @change="changeFirst">
            <el-option label="请选择" value disabled></el-option>
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 二级分类 -->
        <el-form-item label="二级分类" :label-width="formLabelWidth">
          <el-select v-model="form.second_cateid" placeholder="请选择">
            <el-option label="请选择" value disabled></el-option>
            <el-option
              v-for="item in second_List"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 商品名称 -->
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="form.goodsname"></el-input>
        </el-form-item>
        <el-form-item label="价格" :label-width="formLabelWidth">
          <el-input v-model="form.price"></el-input>
        </el-form-item>
        <el-form-item label="市场价格" :label-width="formLabelWidth">
          <el-input v-model="form.market_price"></el-input>
        </el-form-item>
        <el-form-item label="图片" :label-width="formLabelWidth">
          <el-upload
            class="avatar-uploader"
            action="#s"
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <!-- 商品规格 -->
        <el-form-item label="商品规格" :label-width="formLabelWidth">
          <el-select v-model="form.specsid" placeholder="请选择" @change="changeSpecs">
            <el-option label="请选择" value disabled></el-option>
            <el-option
              v-for="item in specsList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 规格属性 -->
        <el-form-item label="规格属性" :label-width="formLabelWidth">
          <el-select v-model="form.specsattr" placeholder="请选择">
            <el-option label="请选择" value disabled></el-option>
            <el-option v-for="item in attrArr" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <!-- 是否新品 -->
        <el-form-item label="是否新品" :label-width="formLabelWidth">
          <el-radio v-model="form.isnew" :label="1">是</el-radio>
          <el-radio v-model="form.isnew" :label="2">否</el-radio>
        </el-form-item>
        <el-form-item label="是否热卖" :label-width="formLabelWidth">
          <el-radio v-model="form.ishot" :label="1">是</el-radio>
          <el-radio v-model="form.ishot" :label="2">否</el-radio>
        </el-form-item>
        <!-- form.status -->
        <el-form-item label="状态" :label-width="formLabelWidth">
          <!-- :active-value="1" 打开开关的值
          :inactive-value="2" 关闭开关的值-->
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
        <el-form-item label="商品描述" :label-width="formLabelWidth">
          <textarea v-model="form.description" cols="30" rows="10"></textarea>
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
  reqcatelist,
  reqgoodsinfo,
  reqgoodsedit,
  reqgoodsadd,
} from "../../../../request/api";
import { errorAlert, successAlert } from "../../../../utils/alert";
import path from "path";
export default {
  /*4.from组件通过props接受info */
  props: ["info"],
  data() {
    return {
      /* 7. 需要传给后端的数据也是输入框内容的数据*/
      form: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: "",
        isnew: 1,
        ishot: 1,
        status: 1,
      },
      formLabelWidth: "120px",
      second_List: [],
      imageUrl: null,
      attrArr: [],
    };
  },
  mounted() {
    //如果没有一级分类就请求一次
    if (this.cateList.length == 0) {
      this.getChangeCateList();
    }
    //如果没有规格就请求一次
    this.getspecsList(true);
  },
  computed: {
    ...mapGetters({
      user: "user",
      cateList: "cate/cateList",
      specsList: "specs/specsList",
    }),
  },
  methods: {
    ...mapActions({
      changeUser: "changeUser",
      getChangeCateList: "cate/getChangeList",
      getChangeList: "shop/reqList",
      getspecsList: "specs/getspecsList",
      reqTotal:"shop/reqTotal"
    }),
    beforeAvatarUpload(file) {
      //判断图片大小 不能超过2m
      if (!file.size > 2 * 1024 * 1024) {
        errorAlert("图片大小不能超过2M");
        return;
      }
      //判断是不是图片格式
      let extname = path.extname(file.name);
      let extArr = [".jpeg", ".jpg", ".png", ".gif", ".svg"];
      if (extArr.indexOf(extname) == -1) {
        errorAlert("请上传正确的图片格式");
        return;
      }
      this.imageUrl = URL.createObjectURL(file);
      this.form.img = file;
    },
    //一级分类改变
    changeFirst() {
      this.form.second_cateid = "";
      this.changeSecond();
    },
    //一级分类改变请求二级分类
    changeSecond() {
      reqcatelist({ pid: this.form.first_cateid }).then((res) => {
        if (res.data.code == 200) {
          this.second_List = res.data.list ? res.data.list : [];
        }
      });
    },
    //商品规格改变
    changeSpecs() {
      this.form.specsattr = [];
      this.getAttrs();
    },
    getAttrs() {
      let obj = this.specsList.find((item) => item.id == this.form.specsid);
      this.attrArr = obj ? obj.attrs : [];
    },
    //清空
    empty() {
      this.form = {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: "",
        isnew: 1,
        ishot: 1,
        status: 1,
      };
      this.second_List = [];
      this.imageUrl = null;
      this.attrArr = [];
    },
    //触发添加事件
    addMenu() {
      /* 发送请求 */
      reqgoodsadd(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert("添加成功");
          // 添加成功后清空输入框的内容
          this.empty();
          //弹框消失
          this.info.isshow = false;
          //list请求数据重新渲染
          this.getChangeList();
          this.reqTotal();
        }
      });
    },
    //触发编辑事件
    sureEdit() {
      /* 发起请求 */
      reqgoodsedit({
        ...this.form,
        specsattr: this.form.specsattr.join(","),
      }).then((res) => {
        if (res.data.code == 200) {
          successAlert("修改成功");
          /* 弹框消失 */
          this.info.isshow = false;
          /* 成功后清空输入框内容，调用empty方法 */
          this.empty();
          //list请求数据重新渲染
          this.getChangeList();
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
      reqgoodsinfo({ id }).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list ? res.data.list : this.form;
          this.form.id = id;
          this.changeSecond();
          this.form.specsattr = this.form.specsattr.split(",");
          this.getAttrs();
          this.imageUrl = this.$pre + this.form.img;
          // this.form.uid = id;
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