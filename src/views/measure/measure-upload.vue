<template>
  <el-card class="box-card">
    <div slot="header" class="card-header">
      <span>
        <linkButton class="back"><i class="el-icon-back"></i></linkButton>
        <span>返回</span>
      </span>
    </div>
  </el-card>
</template>
<script>
export default {
}
</script>
<style lang="less" scoped>
.box-card {
  min-height: 100%;
  .el-card__header {
    height: 64px;
    .card-header {
      .card-header>span {
        line-height: 31px;
      }
      .back {
        font-size: 24px;
      }
    }

  }
}
</style>
