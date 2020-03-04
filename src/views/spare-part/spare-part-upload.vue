<template>
  <el-card class="box-card">
    <div slot="header" class="card-header">
      <span class="card-header-left">
        <link-button class="back" @click="goBack"><i class="el-icon-back"></i></link-button>
        <span>返回</span>
      </span>
    </div>
    <div class="card-content">
      <div v-if="spareParts.length > 0">
        <el-table
          :data="spareParts"
          tooltip-effect="dark"
          border
          fit
          style="width: 100%;"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            v-for="item in columns"
            :property="item.prop"
            :label="item.label"
            :key="item.prop"
            align="center"
          >
          </el-table-column>
        </el-table>
        <own-button @click="handleUpload">确认无误，点击上传</own-button>&nbsp;&nbsp;
        <own-button @click="handleCancel">撤销</own-button>
      </div>
      <div v-else>
        <span  style="font-weight: bold">请根据模板文件的格式进行上传</span>
        <link-button @click="handleExport">下载模板</link-button><br/><br/>
        <input type="file" @change="handleChange" :accept="acceptType"/>
      </div>
    </div>
  </el-card>
</template>
<script>
import { mapState } from 'vuex';
import xlsxUtils from '../../utils/xlsxUtils';
import formatDate from '../../utils/format-excel-date';
import { sparePartConstants } from '../../utils/constants';
import { reqUploadSpareParts } from '../../api';
import downloadTemplate from '../../utils/downloadTemplate';

export default {
  data() {
    return {
      spareParts: [],
      acceptType: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
    }
  },
  computed: {
    ...mapState(['user'])
  },
  beforeMount() {
    this.initColumns();
  },
  methods: {
    // 初始化表格结构
    initColumns() {
      this.columns = [
        {
          label: '序号',
          prop: 'index'
        },
        {
          label: '备件名称',
          prop: 'name',
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
      ]
    },
    goBack() {
      this.$router.go(-1);
      this.spareParts = [];
    },
    handleExport() {
      downloadTemplate('spare-part');
    },
    // 文件读取后处理文件内容
    handleChange(e) {
      xlsxUtils.readWorkbookFromLocalFile(e.target.files[0], (json) => {
        // console.log(json);
        const spareParts = json.reduce((pre, item, index) => {
          const sparePart = {};
          Object.keys(sparePartConstants).forEach((key) => {
            if (key === 'time') {
              if (typeof (item[sparePartConstants[key]]) === 'number') {
                sparePart[key] = formatDate(item[sparePartConstants[key]], '/');
              } else if (/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/.test(item[sparePartConstants[key]])) {
                sparePart[key] = item[sparePartConstants[key]];
              }
            } else {
              sparePart[key] = item[sparePartConstants[key]];
            }
          });
          sparePart.committer = sparePart.committer ? sparePart.committer : this.user.username;
          sparePart.key = index;
          pre.push(sparePart);
          return pre;
        }, []);
        this.spareParts = spareParts;
      });
    },
    async handleUpload() {
      const { spareParts } = this;

      const result = await reqUploadSpareParts(spareParts);
      if (result.status === 0) {
        this.$message.success('上传备件采购单成功');
        this.spareParts = [];
        this.$router.replace('/spare-part');
      } else {
        this.$message.error(result.msg);
      }
    },
    handleCancel() {
      this.spareParts = [];
    }
  }
}
</script>
<style lang="less" scoped>
.box-card {
  min-height: 100%;
  .card-header {
    .card-header-left {
      line-height: 31px;
      .back {
        font-size: 24px;
      }
      & > span {
        vertical-align: top;
      }
    }
  }
  .card-content {
    font-size: 14px;
  }
}
</style>
