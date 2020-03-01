<template>
  <el-card class="box-card">
    <div slot="header" class="card-header">
      <span>请选择需查询的提交时间:</span>&nbsp;&nbsp;
      <el-date-picker
        v-model="value1"
        type="daterange"
        size="small"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <span style="float: right;">
        <own-button><i class="el-icon-upload"></i>上传</own-button>
        <own-button><i class="el-icon-download"></i>导出</own-button>
        <own-button><i class="el-icon-plus"></i>批量通过</own-button>
        <own-button><i class="el-icon-plus"></i>申购</own-button>
      </span>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      border
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column
        type="index"
        label="序号"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column
        v-for="item in columns"
        :property="item.prop"
        :label="item.label"
        :key="item.prop"
        align="center"
      >
      </el-table-column>
      <el-table-column label="操作" align="center">
      <template slot-scope="scope">
        <own-button
          size="mini"
          @click="handleEdit(scope.$index, scope.row)">编辑</own-button>
      </template>
    </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      searchType: 'name',
      searchName: '',
      tableData: [],
      columns: []
    }
  },
  beforeMount() {
    this.initColumns();
  },
  methods: {
    // 初始化表格结构
    initColumns() {
      this.columns = [
        {
          label: '备件名称',
          prop: 'name'
        },
        {
          label: '型号',
          prop: 'model'
        },
        {
          label: '规格',
          prop: 'specs'
        },
        {
          label: '品牌',
          prop: 'brand'
        },
        {
          label: '单价',
          prop: 'price'
        },
        {
          label: '数量',
          prop: 'num'
        },
        {
          label: '单位',
          prop: 'unit'
        },
        {
          label: '总价',
          prop: 'total'
        },
        {
          label: '用途',
          prop: 'usage'
        },
        {
          label: '提交日期',
          prop: 'time'
        },
        {
          label: '提交人',
          prop: 'committer'
        },
        {
          label: '状态',
          prop: 'status'
        }
      ];
    }
  }
}
</script>
<style lang="less" scoped>
.box-card {
  .el-card__header {
    height: 64px;
    .input-with-select {
      width: 300px;
      .select {
        width: 100px;
      }
    }
  }
}
</style>
