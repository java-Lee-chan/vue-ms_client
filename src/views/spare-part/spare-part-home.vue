<template>
  <el-card class="box-card">
    <div slot="header" class="card-header">
      <span>请选择需查询的提交时间:</span>&nbsp;&nbsp;
      <el-date-picker
        v-model="timeRange"
        @change="handleSparePartTimeSearch"
        value-format="yyyy/MM/dd"
        type="daterange"
        size="small"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <span style="float: right;">
        <own-button @click="$router.push('/spare-part/upload')">
          <i class="el-icon-upload"></i>
          上传
        </own-button>
        <own-button @click="handleExport">
          <i class="el-icon-download"></i>
          导出
        </own-button>
        <own-button><i class="el-icon-plus"></i>批量通过</own-button>
        <own-button @click="handleAdd">
          <i class="el-icon-plus"></i>
          申购
        </own-button>
      </span>
    </div>
    <el-table
      :data="spareParts"
      tooltip-effect="dark"
      border
      fit
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
        <link-button
          size="mini"
          @click="handleUpdate(scope.$index, scope.row)">编辑</link-button>
      </template>
    </el-table-column>
    </el-table>
  </el-card>
</template>
<script>
import { mapState } from 'vuex';
import moment from 'moment';
import { reqGetSpareParts } from '../../api';
import xlsxUtils from '../../utils/xlsxUtils';
import { sparePartConstants } from '../../utils/constants';

export default {
  data() {
    return {
      timeRange: [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
      spareParts: [],
      columns: []
    }
  },
  computed: {
    ...mapState(['user'])
  },
  beforeMount() {
    this.initColumns();
  },
  mounted() {
    const { timeRange } = this;
    this.getSpareParts(timeRange);
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
    },
    async getSpareParts(timeRange) {
      const start = moment(timeRange[0]).format('YYYY/MM/DD');
      const end = moment(timeRange[1]).format('YYYY/MM/DD');
      const committer = this.user.username;
      const result = await reqGetSpareParts(start, end, committer);
      if (result.status === 0) {
        const spareParts = result.data;
        this.spareParts = spareParts;
      } else {
        this.$message.error(result.msg);
      }
    },
    handleExport() {
      const { spareParts } = this;
      const results = spareParts.reduce((pre, item, index) => {
        const sparePart = {};
        Object.keys(sparePartConstants).forEach((key) => {
          sparePart[sparePartConstants[key]] = item[key];
        });
        sparePart['序号'] = index + 1;
        pre.push(sparePart);
        return pre;
      }, []);
      xlsxUtils.exportWorkbookFromServerFile(results, 'spare-part');
    },
    handleSelectionChange() {

    },
    handleSparePartTimeSearch(value) {
      if (value) {
        this.getSpareParts(value);
      } else {
        this.spareParts = [];
      }
    },
    handleAdd() {
      const query = {
        type: 'add'
      };
      this.$router.push({ name: 'sparePart-addupdate', query });
    },
    handleUpdate(index, sparePart) {
      const query = {
        type: 'update',
        _id: sparePart._id
      };
      this.$router.push({ name: 'sparePart-addupdate', query });
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
