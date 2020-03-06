<template>
  <el-card class="box-card">
    <div slot="header" class="card-header">
      <el-select v-model="searchType" @change="handleSearchTypeChange"
        class="select" placeholder="请选择" style="width: 100px" size="small">
        <el-option label="器具名称" value="name"></el-option>
        <el-option label="计量编号" value="_id"></el-option>
        <el-option label="有效期至" value="next_time"></el-option>
      </el-select>
      <el-input v-if="searchType !== 'next_time'" v-model="searchName" @input="handleMeasureSearch"
        placeholder="输入搜索内容" size="small" class="input-with-select" style="width: 200px">
      </el-input>
      <el-date-picker
        v-else
        v-model="searchTime"
        @change="handleMeasureTimeSearch"
        value-format="yyyy/MM/dd"
        type="daterange"
        size="small"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      >
      </el-date-picker>
      <span style="float: right;">
        <own-button @click="$router.push('/measure/upload')">
          <i class="el-icon-upload"></i>
          上传
        </own-button>
        <own-button @click="handleExport"><i class="el-icon-download"></i>导出</own-button>
        <own-button @click="handleAdd">
          <i class="el-icon-plus"></i>
          添加
        </own-button>
        <own-button><i class="el-icon-plus"></i>批量确认</own-button>
      </span>
    </div>
    <el-table
      ref="multipleTable"
      :data="searchMeasures.slice((currentPage - 1) * pagesize, currentPage*pagesize)"
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
        :sortable="item.sortable"
        :sort-method="item['sort-method']"
        :filters="item.filters"
        :column-key="item['column-key']"
        :label="item.label"
        :key="item.prop"
        align="center"
      >
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <link-button
            size="mini"
            @click="handleUpdate(scope.$index, scope.row)"
          >
            编辑
          </link-button>
          <link-button
            size="mini"
            type="danger"
            @click="handleCheck(scope.$index, scope.row)"
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
        :hide-on-single-page="true"
        @current-change="changePage">
      </el-pagination>
    </div>
  </el-card>
</template>
<script>
import { reqGetMeasures } from '../../api';
import xlsxUtils from '../../utils/xlsxUtils';
import { measureConstants } from '../../utils/constants';

export default {
  data() {
    return {
      searchType: 'name',
      searchName: '',
      searchTime: '',
      measures: [],
      searchMeasures: [],
      columns: [],
      pagesize: 10,
      currentPage: 1
    }
  },
  computed: {
    // eslint-disable-next-line
    total: {
      // eslint-disable-next-line
      get: function () {
        return this.searchMeasures.length
      },
      // eslint-disable-next-line
      set: function () {}
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
          sortable: true,
          'sort-method': (a, b) => a.next_time < b.next_time
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
          filters: [
            {
              text: 'INJ',
              value: 'INJ'
            },
            {
              text: 'BPR',
              value: 'BPR'
            },
            {
              text: 'INP',
              value: 'INP'
            },
            {
              text: '保全系',
              value: '保全系'
            },
            {
              text: '品质系',
              value: '品质系'
            }
          ],
          // 'filter-method': (value, row, column) => {
          //   // eslint-disable-next-line
          //   const property = column['property'];
          //   return row[property].indexOf(value) === 0;
          // }
          'column-key': 'location'
        },
        {
          label: '状态',
          prop: 'status',
          filters: [
            {
              text: '送检',
              value: '送检',
            },
            {
              text: '在库',
              value: '在库',
            },
            {
              text: '维修',
              value: '维修',
            },
            {
              text: '新增',
              value: '新增',
            },
          ],
          'column-key': 'status'
        }
      ];
    },
    async getMeasures() {
      const result = await reqGetMeasures();
      if (result.status === 0) {
        const measures = result.data;
        this.measures = measures;
        this.searchMeasures = measures;
        this.total = measures.length;
      } else {
        this.$message.error(result.msg);
      }
    },
    handleExport() {
      const { searchMeasures } = this;
      const measures = searchMeasures.reduce((pre, item, index) => {
        const measure = {};
        Object.keys(measureConstants).forEach((key) => {
          measure[measureConstants[key]] = item[key];
        });
        measure['序号'] = index + 1;
        pre.push(measure);
        return pre;
      }, []);
      xlsxUtils.exportWorkbookFromServerFile(measures, 'measure');
    },
    handleSearchTypeChange() {
      this.searchMeasures = this.measures;
    },
    handleMeasureSearch(value) {
      const searchName = value.trim();
      const { searchType, measures } = this;
      const searchMeasures = measures.filter((measure) => (
        measure[searchType].toLowerCase().indexOf(searchName.toLowerCase()) !== -1
      ));
      this.searchMeasures = searchMeasures;
    },
    handleMeasureTimeSearch(value) {
      const { measures } = this;
      if (value) {
        const searchMeasures = measures.filter((measure) => (
          measure.next_time < value[1] && measure.next_time > value[0]
        ));
        this.searchMeasures = searchMeasures;
      } else {
        this.searchMeasures = measures;
      }
    },
    changePage(currentPage) {
      this.currentPage = currentPage;
    },
    handleAdd() {
      const query = {
        type: 'add'
      };
      this.$router.push({ name: 'measure-addupdate', query });
    },
    handleUpdate(index, measure) {
      const query = {
        type: 'update',
        _id: measure._id
      };
      this.$router.push({ name: 'measure-addupdate', query });
    },
    handleCheck(index, measure) {
      const query = {
        type: 'check',
        _id: measure._id
      };
      this.$router.push({ name: 'measure-addupdate', query });
    }
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
