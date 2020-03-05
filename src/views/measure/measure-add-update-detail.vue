<template>
  <el-card class="box-card">
    <div slot="header" class="card-header">
      <span class="card-header-left">
        <link-button class="back" @click="$router.go(-1);">
          <i class="el-icon-back"></i>
        </link-button>
        <span>{{cardTitle}}</span>
      </span>
    </div>
    <el-form ref="measureForm" :model="measureForm" :rules="rules" label-width="90px" size="small">
      <el-row>
        <el-col :xs="{offset: 4, span: 16}" :sm="{offset: 1, span: 9}">
          <el-form-item prop="_id" label="计量编号:">
            <el-input v-model="measureForm._id" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="{offset: 4, span: 16}" :sm="{offset: 3, span: 9}">
          <el-form-item prop="name" label="器具名称:">
            <el-input v-model="measureForm.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="{offset: 4, span: 16}" :sm="{offset: 1, span: 9}">
          <el-form-item prop="model" label="规格型号:">
            <el-input v-model="measureForm.model" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="{offset: 4, span: 16}" :sm="{offset: 3, span: 9}">
          <el-form-item prop="factory_num" label="出厂编号:">
            <el-input v-model="measureForm.factory_num" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="{offset: 4, span: 16}" :sm="{offset: 1, span: 9}">
          <el-form-item prop="manufacturer" label="制造商:">
            <el-input v-model="measureForm.manufacturer" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="{offset: 4, span: 16}" :sm="{offset: 3, span: 9}">
          <!-- 检定日期 -->
          <el-form-item prop="last_time" label="检定日期:">
            <el-date-picker
              v-model="measureForm.last_time"
              type="date"
              placeholder="选择日期"
              style="width: 100%">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :xs="{offset: 4, span: 16}" :sm="{offset: 1, span: 9}">
          <el-form-item prop="duration" label="检定周期:">
            <el-select v-model="measureForm.duration" style="width: 100%">
              <el-option value="3个月" label="3个月"></el-option>
              <el-option value="6个月" label="6个月"></el-option>
              <el-option value="12个月" label="12个月"></el-option>
              <el-option value="长期" label="长期"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="{offset: 4, span: 16}" :sm="{offset: 3, span: 9}">
          <!-- 有效期至 -->
          <el-form-item prop="next_time" label="有效期至:">
            <el-date-picker
              v-model="measureForm.next_time"
              type="date"
              disabled=""
              placeholder="选择日期"
              style="width: 100%">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :xs="{offset: 4, span: 16}" :sm="{offset: 1, span: 9}">
          <el-form-item prop="abc" label="ABC管理:">
            <el-select v-model="measureForm.abc" style="width: 100%">
              <el-option value="A" label="A"></el-option>
              <el-option value="B" label="B"></el-option>
              <el-option value="C" label="C"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="{offset: 4, span: 16}" :sm="{offset: 3, span: 9}">
          <el-form-item prop="result" label="检定结果:">
            <el-select v-model="measureForm.result" style="width: 100%">
              <el-option value="合格" label="合格"></el-option>
              <el-option value="不合格" label="不合格"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="{offset: 4, span: 16}" :sm="{offset: 1, span: 9}">
          <el-form-item prop="location" label="使用地点:">
            <el-select v-model="measureForm.location" style="width: 100%">
              <el-option value="INJ" label="INJ"></el-option>
              <el-option value="BPR" label="BPR"></el-option>
              <el-option value="INP" label="INP"></el-option>
              <el-option value="保全系" label="保全系"></el-option>
              <el-option value="品质系" label="品质系"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="{offset: 4, span: 16}" :sm="{offset: 3, span: 9}">
          <el-form-item prop="usage" label="用途:">
            <el-input v-model="measureForm.usage" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="{offset: 4, span: 16}" :sm="{offset: 1, span: 9}">
          <el-form-item prop="type" label="送检类型:">
            <el-select v-model="measureForm.type" style="width: 100%">
              <el-option value="校准" label="校准"></el-option>
              <el-option value="检定" label="检定"></el-option>
              <el-option value="送检" label="送检"></el-option>
              <el-option value="现场检定" label="现场检定"></el-option>
              <el-option value="自立化检定" label="自立化检定"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="{offset: 4, span: 16}" :sm="{offset: 3, span: 9}">
          <el-form-item prop="status" label="状态:">
            <el-select v-model="measureForm.status" style="width: 100%">
              <el-option value="在库" label="在库"></el-option>
              <el-option value="维修" label="维修"></el-option>
              <el-option value="送检" label="送检"></el-option>
              <el-option value="新增" label="新增"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="{offset: 10}" :sm="{offset: 15}">
          <el-form-item>
            <own-button @click="onSubmit">提交</own-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      cardTitle: '添加计量仪器',
      measureForm: {
        _id: '',
        name: '',
        model: '',
        factory_num: '',
        manufacturer: '',
        last_time: '',
        duration: '',
        next_time: '',
        abc: '',
        result: '',
        location: '',
        usage: '',
        type: '',
        status: ''
      },
      rules: {
        _id: [],
        name: [],
        model: [],
        factory_num: [],
        manufacturer: [],
        last_time: [],
        duration: [],
        next_time: [],
        abc: [],
        result: [],
        location: [],
        usage: [],
        type: [],
        status: []
      }
    }
  },
  methods: {
    onSubmit() {

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
