<template>
  <div>
    <v-list @toEdit="toEdit" ></v-list>
    <v-from :info="info" ref="from" ></v-from>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import vFrom from "./components/from";
import vList from "./components/list";
export default {
  props: [""],
  data() {
    return {
      info: {
        isshow: false,
      },
      AMember: [],
    };
  },
  components: {
    vFrom,
    vList,
  },
  mounted() {
  },
  computed: {
    ...mapGetters({}),
  },
  methods: {
    ...mapActions({}),
    toEdit(uid) {
      this.$refs.from.toEdit(uid);
    },
  },
};
</script>
<style	scoped	lang="less">
@import "../../less/index.less";
</style>