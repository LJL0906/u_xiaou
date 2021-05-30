<template>
  <div>
    <!-- close：el-dialog关闭的回调函数 -->
    <!--5.:visible.sync="info.isshow"对应el-dialog 显示隐藏弹框 所以绑定info的isshow-->
    <!--6.用组件绘制输入框的页面 -->
    <el-dialog :title="info.isAdd?'活动添加':'活动编辑'" :visible.sync="info.isshow" @close="close">
      {{form}}
      <el-form :model="form">
        <!-- 7.form.title -->
        <el-form-item label="活动名称" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 活动期限 -->
        <el-form-item label="活动期限" :label-width="formLabelWidth">
          <el-date-picker
            v-model="value1"
            type="daterange"
            range-separator="至"
            :start-placeholder="form.begintime"
            :end-placeholder="form.endtime"
            unlink-panels
            @change="getTime"
          ></el-date-picker>
        </el-form-item>
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
          <el-select v-model="form.second_cateid" placeholder="请选择" @change="secondChange()">
            <el-option label="请选择" value disabled></el-option>
            <el-option
              v-for="item in second_List"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 商品 -->
        <el-form-item label="商品" :label-width="formLabelWidth">
          <el-select v-model="form.goodsid" placeholder="请选择">
            <el-option label="请选择" value disabled></el-option>
            <el-option
              v-for="item in shop_List"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
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
import {
  reqcatelist,
  reqseckadd,
  reqgoodslist,
  reqseckinfo,
  reqseckedit,
} from "../../../../request/api";
import { successAlert } from "../../../../utils/alert";
export default {
  /*4.from组件通过props接受info */
  props: ["info"],
  data() {
    return {
      value1: "",
      /* 7. 需要传给后端的数据也是输入框内容的数据*/
      form: {
        title: "",
        begintime: "开始日期",
        endtime: "结束日期",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      },
      formLabelWidth: "120px",
      second_List: [],
      shop_List: [],
      time: [],
    };
  },
  mounted() {
    //如果没有一级分类就请求一次
    if (this.cateList.length == 0) {
      this.getChangeCateList();
    }
  },
  computed: {
    ...mapGetters({
      cateList: "cate/cateList",
    }),
  },
  methods: {
    ...mapActions({
      getChangeCateList: "cate/getChangeList",
      getSeckIllList: "seckill/getSeckIllList",
    }),
    //获取时间
    getTime(e) {
      e.forEach((item) => {
        this.time.push(item.toLocaleDateString());
      });
      this.form.begintime = this.time[0];
      this.form.endtime = this.time[1];
    },
    //一级分类改变
    changeFirst() {
      this.form.second_cateid = "";
      this.form.goodsid = "";
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
    //二级分类改变请求二级分类下的商品
    secondChange() {
      this.form.goodsid = "";
      this.shop_List = [];
      this.reqShop();
    },
    reqShop() {
      reqgoodslist().then((res) => {
        let list = res.data.list ? res.data.list : [];
        this.shop_List = list.filter((item) => {
          if (item.second_cateid == this.form.second_cateid) {
            return item;
          }
        });
      });
    },
    //清空s
    empty() {
       this.form= {
        title: "",
        begintime: "开始日期",
        endtime: "结束日期",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      };
      this.second_List= [];
      this.shop_List= [];
      this.time= [];
    },
    //触发添加事件
    addMenu() {
      /* 发送请求 */
      reqseckadd(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert("添加成功");
          // 添加成功后清空输入框的内容
          this.empty();
          //弹框消失
          this.info.isshow = false;
          // //list请求数据重新渲染
          this.getSeckIllList();
        }
      });
    },
    //触发编辑事件
    sureEdit() {
      /* 发起请求 */
      reqseckedit(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert("修改成功");
          /* 弹框消失 */
          this.info.isshow = false;
          //list请求数据重新渲染
          this.getSeckIllList();
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
      reqseckinfo({ id }).then((res) => {
        if (res.data.code == 200) {
          this.form = res.data.list ? res.data.list : this.form;
          this.form.id = id;
          this.changeSecond();
          this.reqShop();
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