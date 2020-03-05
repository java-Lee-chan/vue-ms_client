<template>
  <el-card class="box-card">
    <div slot="header" class="card-header">
      <span class="card-header-left">
        <link-button class="back" @click="goBack"><i class="el-icon-back"></i></link-button>
        <span>返回</span>
      </span>
    </div>
    <div class="card-content">
      <div v-if="dataSource.length > 0">
        <el-table
          :data="dataSource"
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
        <div style="margin-top: 10px">
          <own-button @click="handleUpload">确认无误，点击上传</own-button>&nbsp;&nbsp;
          <own-button @click="handleCancel">撤销</own-button>
        </div>
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
import xlsxUtils from '../../utils/xlsxUtils';
import formatDate from '../../utils/format-excel-date';
import { measureConstants } from '../../utils/constants';
import { reqUploadMeasures } from '../../api';
import downloadTemplate from '../../utils/downloadTemplate';

export default {
  data() {
    return {
      dataSource: [],
      acceptType: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
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
          label: '计量编号',
          prop: '_id',
        },
        {
          label: '器具名称',
          prop: 'name',
        },
        {
          label: '规格型号',
          prop: 'model'
        },
        {
          label: '出厂编号',
          prop: 'factory_num'
        },
        {
          label: '制造商',
          prop: 'manufacturer'
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
          label: 'ABC管理',
          prop: 'abc'
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
          label: '用途',
          prop: 'usage'
        },
        {
          label: '送检类型',
          prop: 'type'
        },
        {
          label: '状态',
          prop: 'status',
        },
      ];
    },
    goBack() {
      this.$router.go(-1);
      this.dataSource = [];
    },
    handleExport() {
      downloadTemplate('measure');
    },
    // 文件读取后处理文件内容
    handleChange(e) {
      xlsxUtils.readWorkbookFromLocalFile(e.target.files[0], (json) => {
        const measures = json.reduce((pre, item) => {
          const measure = {};
          Object.keys(measureConstants).forEach((key) => {
            if (key === 'last_time' || key === 'next_time') {
              if (key === 'next_time' && item['检定周期'] === '长期') {
                measure[key] = '-';
              } else {
                if (/^[0-9]{4}\/[0-9]{2}\/[0-9]{2}$/.test(item[measureConstants[key]])) {
                  measure[key] = item[measureConstants[key]];
                }
                if (typeof (item[measureConstants[key]]) === 'number') {
                  measure[key] = formatDate(item[measureConstants[key]], '/');
                }
              }
            } else {
              measure[key] = item[measureConstants[key]];
            }
          });
          pre.push(measure);
          return pre;
        }, []);
        this.dataSource = measures;
      });
    },
    async handleUpload() {
      const { dataSource } = this;

      const result = await reqUploadMeasures(dataSource);
      if (result.status === 0) {
        this.$message.success('上传测量仪器成功');
        this.dataSource = [];
        this.$router.replace('/measure');
      } else {
        this.$message.error(result.msg);
      }
    },
    handleCancel() {
      this.dataSource = [];
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
