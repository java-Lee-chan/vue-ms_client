<template>
  <el-card class="box-card">
    <div slot="header" class="card-header">
      <el-input placeholder="输入搜索内容" size="small" v-model="searchName" class="input-with-select">
        <el-select v-model="searchType" class="select" slot="prepend" placeholder="请选择">
          <el-option label="器具名称" value="name"></el-option>
          <el-option label="计量编号" value="_id"></el-option>
          <el-option label="有效期至" value="next_time"></el-option>
        </el-select>
      </el-input>
      <span style="float: right;">
        <own-button @click="$router.push('/measure/upload')">
          <i class="el-icon-upload"></i>
          上传
        </own-button>
        <own-button><i class="el-icon-download"></i>导出</own-button>
        <own-button @click="$router.push('/measure/addupdate')">
          <i class="el-icon-plus"></i>
          添加
        </own-button>
        <own-button><i class="el-icon-plus"></i>批量确认</own-button>
      </span>
    </div>
    <el-table
      ref="multipleTable"
      :data="tableData.slice((currentPage - 1) * pagesize, currentPage*pagesize)"
      tooltip-effect="dark"
      border
      fit
      max-height="1000"
      style="width: 100%;"
    >
      <el-table-column
        type="selection"
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
          <link-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >
            编辑
          </link-button>
          <link-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >
            查看
          </link-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-container">
      <el-pagination
        background
        layout="prev, pager, next, sizes, jumper"
        :page-sizes="[10, 20, 30, 50, 100]"
        :total="total"
        @current-change="changePage">
      </el-pagination>
    </div>
  </el-card>
</template>
<script>
import { reqGetMeasures } from '../../api';

export default {
  data() {
    return {
      searchType: 'name',
      searchName: '',
      tableData: [],
      columns: [],
      total: 0,
      pagesize: 10,
      currentPage: 1
    }
  },
  beforeMount() {
    this.initColumns();
  },
  mounted() {
    this.getMeasures();
  },
  methods: {
    // 初始化表格结构
    initColumns() {
      this.columns = [
        {
          label: '计量编号',
          prop: '_id',
        },
        {
          label: '器具名称',
          prop: 'name',
        },
        {
          label: '检定时间',
          prop: 'last_time'
        },
        {
          label: '有效期至',
          prop: 'next_time',
        },
        {
          label: '检定周期',
          prop: 'duration'
        },
        {
          label: '检定结果',
          prop: 'result'
        },
        {
          label: '使用地点',
          prop: 'location',
        },
        {
          label: '状态',
          prop: 'status',
        }
      ];
    },
    async getMeasures() {
      const result = await reqGetMeasures();
      if (result.status === 0) {
        const measures = result.data;
        console.log(measures);
        this.tableData = measures;
        this.total = measures.length;
      } else {
        this.$message.error(result.msg);
      }
    },
    changePage(currentPage) {
      this.currentPage = currentPage;
    },
  }
}
</script>
<style lang="less" scoped>
.box-card {
  min-height: 100%;
  .el-card__header {
    height: 64px;
    .input-with-select {
      width: 300px;
      .select {
        width: 100px;
      }
    }
  }
  .page-container {
    text-align: right;
    margin-top: 20px;
  }
}
</style>
