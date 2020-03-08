<template>
  <div class="home-container">
    <div class="home-left">
      <el-card
        style="height: 100%"
      >
        <div slot="header">
          <span>{{`${time}能源使用情况`}}</span>
        </div>
        <div class="echart-wrapper">
          <div class="home-left-top">
            <div id="myGasChart" style="width: 90%;height: 200px;"></div>
          </div>
          <div class="home-left-center">
            <div id="myWaterChart" style="width: 90%;height: 200px;"></div>
          </div>
          <div class="home-left-bottom">
            <div id="myElecChart" style="width: 90%;height: 200px;" ></div>
          </div>
        </div>
      </el-card>
    </div>
    <div class="home-right">
      <div class="home-right-top">
        <el-card
          title="下列仪器将在3个月内过期"
          style="height: 100%; overflow: auto;"
          body-style="padding: 0"
        >
          <div slot="header">
            <span>下列仪器将在3个月内过期</span>
          </div>
          <el-table
            ref="multipleTable"
            :data="dataSource"
            style="fontSize: 10px; width: 365px;margin: 0 auto"
            size="mini"
          >
            <el-table-column
              type="index"
              label="序号"
              align="center"
              width="55">
            </el-table-column>
            <el-table-column prop="_id" label="计量编号" width="90">
            </el-table-column>
            <el-table-column prop="name" label="器具名称" width="130">
            </el-table-column>
            <el-table-column prop="next_time" label="有效期至" width="90">
            </el-table-column>
          </el-table>
          <div style="marginTop: 15px; fontSize: 14px;textAlign: center">
            <span>{{`...共${this.length}个测量仪器快到期，点击`}}</span>
            <link-button @click="$router.push('/measure')">跳转到测量仪器界面</link-button>
          </div>
        </el-card>
      </div>
      <div class="home-right-bottom">
        <el-card
          style="height: 100%"
        >
          <div slot="header">
            <span>本月备件提交情况</span>
          </div>
          <el-timeline style="width: 300px; margin: 0 auto">
            <el-timeline-item
              v-for="activity in timeLines"
              :key="activity._id"
              :hide-timestamp="true"
              type="success"
              :timestamp="activity.time">
              {{`${activity.committer}在${activity.time}提交申购`}}
            </el-timeline-item>
        </el-timeline>
        </el-card>
      </div>
    </div>
  </div>
</template>
<script>
import data from '../../utils/energy-data';
import { reqSparePartTime, reqGetRecentMeasures } from '../../api';

export default {
  data() {
    return {
      data,
      gasDateList: [],
      gasValueList: [],
      elecDateList: [],
      elecValueList: [],
      waterDateList: [],
      waterValueList: [],
      time: '',
      columns: [],
      dataSource: [],
      length: 0,
      timeLines: []
    }
  },
  mounted() {
    const date = new Date();
    const time = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}  ${date.getHours() - 1}:00 ~ ${date.getHours()}:00`
    const dateList = this.data.map((item) => (item[0]));
    const valueList = this.data.map((item) => (item[1]));
    this.gasDateList = dateList;
    this.gasValueList = valueList;
    this.elecDateList = dateList;
    this.elecValueList = valueList;
    this.waterDateList = dateList;
    this.waterValueList = valueList;
    this.time = time;
    this.drawLine();
    this.getMeasures();
    this.getTimeLine();
  },
  methods: {
    drawLine() {
      this.$nextTick(() => {
        const myGasChart = this.$echarts.init(document.getElementById('myGasChart'));
        const myWaterChart = this.$echarts.init(document.getElementById('myWaterChart'));
        const myElecChart = this.$echarts.init(document.getElementById('myElecChart'));
        const {
          gasDateList,
          gasValueList,
          elecDateList,
          elecValueList,
          waterDateList,
          waterValueList
        } = this;
        myGasChart.setOption(this.setOptions('科室天然气用量', gasDateList, gasValueList));
        myWaterChart.setOption(this.setOptions('科室水用量', waterDateList, waterValueList));
        myElecChart.setOption(this.setOptions('科室电用量', elecDateList, elecValueList));
        myGasChart.resize();
        myWaterChart.resize();
        myElecChart.resize();
        window.addEventListener('resize', () => {
          myGasChart.resize();
          myWaterChart.resize();
          myElecChart.resize();
        });
      })
    },
    setOptions(text, dataList, valueList) {
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
        grid: {
          top: 40,
          left: '10%',
          right: '7%',
          height: 100
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
          type: 'bar',
          data: valueList
        }]
      }
    },
    async getMeasures() {
      const result = await reqGetRecentMeasures();
      if (result.status === 0) {
        this.length = result.data.length;
        const dataSource = result.data.sort((a, b) => a.next_time > b.next_time).splice(0, 5);
        this.dataSource = dataSource;
      } else {
        this.$message.error(result.msg);
      }
    },
    async getTimeLine() {
      const result = await reqSparePartTime();
      if (result.status === 0) {
        const timeLines = result.data;
        this.timeLines = timeLines;
      } else {
        this.$message.error('获取备件提交时间失败');
      }
    }
  }
}
</script>
<style lang="less" scoped>
.home-container {
  min-height: 100%;
  display: flex;
  .home-left {
    padding: 10px 0 10px 10px;
    flex: 1 1 auto;
    .echart-wrapper {
      height: 100%;
      display: flex;
      flex-direction: column;
      .home-left-top {
        height: 33.3%;
        flex: 1;
      }
      .home-left-center {
        height: 33.3%;
        flex: 1
      }
      .home-left-bottom {
        height: 33.3%;
        flex: 1
      }
    }
  }
  .home-right {
    flex: 1 0 auto;
    display: flex;
    flex-direction: column;
    .home-right-top {
      padding: 10px;
      height: 50%;
      flex: 1;
    }
    .home-right-bottom {
      padding: 10px;
      height: 50%;
      flex: 1
    }
  }
}
</style>
