<template>
  <el-tabs type="border-card">
    <el-tab-pane label="用气量"></el-tab-pane>
    <el-tab-pane label="用电量"></el-tab-pane>
    <el-tab-pane label="用水量"></el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
  data() {
    return {
    }
  }
}
</script>
<style lang="less" scoped>
.el-tabs{
  min-height: 100%;
  border: none;
  /deep/ .el-tabs__header {
    background-color: #fff;
  }
  /deep/ .el-tabs__nav.is-top {
    padding: 0 24px;
  }
  /deep/ .el-tabs__item.is-active{
    color: #1da57a;
    border: none;
    border-bottom: 3px solid #1da57a;
  }
  /deep/ .el-tabs__item {
    color: rgba(0, 0, 0, .65);
    font-size: 16px;
    font-weight: 400;
    height: 56px;
    line-height: 56px;
    margin-right: 32px;
  }
  /deep/ .el-tabs__item:not(.is-disabled):hover{
    color: #1da57a;
  }
}
</style>
