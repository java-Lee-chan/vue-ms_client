<template>
  <el-container class="base-data-container">
    <el-aside class="base-data-left" width="300px">
      <div>
        <el-input placeholder="请输入内容" v-model="searchValue" size="medium">
          <own-button slot="append">搜索&nbsp;<i class="el-icon-search"></i></own-button>
        </el-input>
        <el-table
          :data="meterLevels"
          row-key="_id"
          fit
          default-expand-all
          :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
          style="width: 100%;"
        >
          <el-table-column
            v-for="item in columns"
            :key="item.prop"
            :label="item.label"
            :prop="item.prop"
            :width="item.width"
          >
          </el-table-column>
        </el-table>
      </div>
    </el-aside>
    <el-container class="base-data-right">
      <el-header class="base-data-right-header">
        <el-radio-group v-model="duration" size="medium">
          <el-radio-button label="day">日</el-radio-button>
          <el-radio-button label="month">月</el-radio-button>
          <el-radio-button label="year">年</el-radio-button>
        </el-radio-group>
        <el-date-picker
          v-model="timeRange"
          @change="handleTimeRangeChange"
          value-format="yyyy/MM/dd"
          type="daterange"
          size="small"
          range-separator="~"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <el-radio-group v-model="type" size="medium" @change="handleTypeChange">
          <el-radio-button label="line">
            <i class="el-icon-data-line"></i>
          </el-radio-button>
          <el-radio-button label="bar">
            <i class="el-icon-pie-chart"></i>
          </el-radio-button>
        </el-radio-group>
      </el-header>
      <el-main class="base-data-right-content">
        <div id="myChart" class="base-data-right-content-chart" style="height: 300px;"></div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import moment from 'moment';
import { reqGetMeterLevel } from '../../../api';
import { translateDataToTree } from '../../../utils/translateDataToTree';

export default {
  data() {
    return {
      searchValue: '',
      duration: 'day',
      type: 'line',
      timeRange: [moment().toDate(), moment().toDate()],
      columns: [],
      meterLevels: []
    }
  },
  beforeMount() {
    this.initColumns();
  },
  mounted() {
    // eslint-disable-next-line
    const data = [["0:00",116],["1:00",129],["2:00",135],["3:00",86],["4:00",73],["5:00",85],["6:00",73],["7:00",68],["8:00",92],["9:00",130],["10:00",245],["11:00",139],["12:00",115],["13:00",111],["14:00",309],["15:00",206],["16:00",137],["17:00",128],["18:00",85],["19:00",94],["20:00",71],["21:00",106],["22:00",84],["23:00",93],["24:00",85]];
    const dateList = data.map((item) => (item[0]));
    const valueList = data.map((item) => (item[1]));
    this.dateList = dateList;
    this.valueList = valueList;
    this.drawLine();
    this.getMeterLevel();
  },
  methods: {
    drawLine() {
      this.$nextTick(() => {
        const myChart = this.$echarts.init(document.getElementById('myChart'));
        const { dateList, valueList, type } = this;
        myChart.setOption(this.setOptions('科室天然气用量', type, dateList, valueList));
        myChart.resize();
        window.addEventListener('resize', () => {
          myChart.resize();
        });
      })
    },
    setOptions(text, type, dataList, valueList) {
      return {
        // Make gradient line here
        visualMap: [{
          show: false,
          type: 'continuous',
          seriesIndex: 0,
        }],
        title: [{
          left: 'center',
          text
        }],
        tooltip: {
          trigger: 'axis'
        },
        xAxis: [{
          name: '位置',
          data: dataList
        }],
        yAxis: [{
          name: '用量 单位',
          splitLine: { show: false }
        }],
        series: [{
          type,
          data: valueList
        }]
      }
    },
    handleTimeRangeChange() {},
    handleTypeChange() {
      this.drawLine();
    },
    initColumns() {
      this.columns = [
        {
          label: '名称',
          prop: 'name',
        },
        {
          label: '类型',
          prop: 'type',
          width: '100'
        }
      ];
    },
    async getMeterLevel() {
      const result = await reqGetMeterLevel();
      if (result.status === 0) {
        const meterLevels = translateDataToTree(result.data);
        this.meterLevels = meterLevels;
      } else {
        this.$message.error(result.msg);
      }
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
      align-items: center;
      background-color: white;
      margin-bottom: 10px;
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
