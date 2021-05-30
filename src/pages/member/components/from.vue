<template>
  <div>
    <el-dialog title="会员编辑" :visible.sync="info.isshow">
      <el-form :model="form">
        <el-form-item label="手机号" :label-width="formLabelWidth">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="昵称" :label-width="formLabelWidth">
          <el-input v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="form.password" autocomplete="off"></el-input>
          <div>留空则不修改</div>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="info.isshow=false">取 消</el-button>
        <el-button type="primary" @click="sureEdit">编 辑</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { reqmemberinfo, reqmemberedit } from "../../../request/api";
import { successAlert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      form: {
        nickname: "",
        phone: "",
        password: "",
        status: 1,
      },
      formLabelWidth: "120px",
    };
  },
  mounted() {},
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({
      getmemberList: "member/getmemberList",
    }),
    toEdit(uid) {
      this.info.isshow = true;
      reqmemberinfo({ uid }).then((res) => {
        if (res.data.code == 200) {
          let list = res.data.list ? res.data.list : {};
          this.form = {
            nickname: list.nickname,
            phone: list.phone,
            password: "",
            status: list.status,
            //补一个uid后面修改要用
            uid: list.uid,
          };
        }
      });
    },
    sureEdit() {
      reqmemberedit(this.form).then((res) => {
        if ((res.data.code = 200)) {
          successAlert("编辑成功");
          this.getmemberList();
          this.info.isshow = false;
        }
      });
    },
  },
};
</script>
<style	scoped	lang="less">
@import "../../../less/index.less";
</style>