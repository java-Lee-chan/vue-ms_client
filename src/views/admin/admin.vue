<template>
  <el-container style="minHeight: 100%;">
    <el-aside width="200px"
      style="height: 100vh; background-color: #091B2D; position: fixed; overflow: hidden"
    >
      <left-nav />
    </el-aside>

    <el-container style="minHeight: 100%; marginLeft: 200px; background-color: #F0F2F4">
      <admin-header />
      <el-main style="margin: 15px; padding: 0px">
        <router-view></router-view>
      </el-main>
      <el-footer class="footer">
        推荐使用谷歌浏览器，可以获得更佳页面操作体验
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import { mapState } from 'vuex';
import leftNav from '../../components/leftNav.vue';
import adminHeader from '../../components/header.vue';

export default {
  data() {
    return {

    }
  },
  components: { leftNav, adminHeader },
  computed: {
    ...mapState(['user'])
  },
  watch: {
    // eslint-disable-next-line
    '$store.state.user': function () {
      if (!this.user || !this.user._id) {
        this.$router.push('/login')
      }
    }
  }
};
</script>

<style lang="less" scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }

  .el-aside {
    color: #333;
  }

  .el-footer {
    line-height: 60px;
    text-align: center;
    background-color: #cccccc
  }
</style>
