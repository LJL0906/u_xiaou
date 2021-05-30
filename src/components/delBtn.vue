<template>
  <el-button type="danger" @click="open">删除</el-button>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: [""],
  data() {
    return {};
  },
  mounted() {},
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    open() {
      this.$confirm("您确定删除吗？", "删除提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$emit("delAlert");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
<style	scoped>
</style>