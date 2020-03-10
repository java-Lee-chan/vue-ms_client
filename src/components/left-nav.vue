<template>
  <div class="left-nav">
    <router-link to="/" class="left-nav-header">
      <img src="../assets/logo.png" class="logo" alt="logo"/>
      <h1>后台管理系统</h1>
    </router-link>
    <el-menu
      background-color="#091B2D"
      text-color="#646C79"
      active-text-color="#fff"
      :default-active="defaultActive"
      @select="setSelection"
    >
      <navagation-item v-for="menu in menuList" :key="menu.key" :item="menu" />
    </el-menu>
  </div>
</template>
<script>
import menuList from '../config/menuConfig';
import navagationItem from './navigation-item.vue';

export default {
  data() {
    return {
      menuList: [],
      defaultActive: ''
    }
  },
  components: { navagationItem },
  watch: {
    // eslint-disable-next-line
    '$route.path': {
      // eslint-disable-next-line
      handler: function(value) {
        const path = value;
        const newPath = `/${path.split('/')[1]}`;
        if (path.indexOf('/energy') !== 0) {
          this.defaultActive = newPath;
        } else if (path.indexOf('/energy/settings') === 0) {
          this.defaultActive = '/energy/settings';
        } else {
          this.defaultActive = path;
        }
      },
      immediate: true
    }
  },
  beforeMount() {
    this.menuList = menuList;
  },
  methods: {
    setSelection(index) {
      this.$router.push(index);
    }
  }
}
</script>
<style lang="less" scoped>
.left-nav {
  .left-nav-header {
    margin-top: 20px;
    display: flex;
    align-items: center;
    height: 80px;
    background-color: #002140;
    text-decoration: none;
    // .collapsedLogo {
    //   width: 40px;
    //   height: 40px;
    //   margin: 0 auto;
    // }
    // .uncollapsedLogo {
    //   width: 40px;
    //   height: 40px;
    //   margin: 0 5px 0 10px;
    // }
    img {
      width: 40px;
      height: 40px;
      margin: 0 5px 0 10px;
    }
    h1 {
      color: white;
      font-size: 15px;
      margin-bottom: 0;
      margin-left: 20px;
    }
  }
  .el-menu {
    border-right: 1px solid #091B2D;
    padding-top: 3px;
    padding-bottom: 5px;
  }

}
</style>
