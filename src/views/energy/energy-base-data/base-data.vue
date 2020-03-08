<template>
  <el-container class="base-data-container">
    <el-aside class="base-data-left" width="300px">aside</el-aside>
    <el-container class="base-data-right">
      <el-header class="base-data-right-header">header</el-header>
      <el-main class="base-data-right-content">Main</el-main>
    </el-container>
  </el-container>
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
.base-data-container {
  min-height: 100%;
  .base-data-left {
    background-color: #fff;
    margin-right: 10px;
    padding: 5px;
  }
  .base-data-right {
    .base-data-right-header {
      display: inline-flex;
      justify-content: space-between;
      background-color: white;
      margin-bottom: 10px;
      .base-data-right-header-date {
        line-height: unset;
      }
    }
    .base-data-right-content {
      background-color: #fff;
      height: 100%;
      width: 100%;
      position: relative;
      .base-data-right-content-chart {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
