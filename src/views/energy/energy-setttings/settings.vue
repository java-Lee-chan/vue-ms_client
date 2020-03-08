<template>
  <div>
    <el-menu :default-active="activeIndex" mode="horizontal" @select="handleSelect">
      <el-menu-item index="gas">天然气表配置</el-menu-item>
      <el-menu-item index="elec">电表配置</el-menu-item>
      <el-menu-item index="water">水表配置</el-menu-item>
    </el-menu>
    <div style="marginTop: 15px">
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: 'gas'
    }
  },
  methods: {
    handleSelect() {}
  }
}
</script>
<style lang="less" scoped>
/deep/ .el-menu--horizontal>.el-menu-item {
  height: 48px;
  line-height: 48px;
  color: rgba(0, 0, 0, .65);
}
/deep/ .el-menu--horizontal>.el-menu-item.is-active {
  border-bottom: 2px solid #1da57a;
  color: #1da57a
}
</style>
