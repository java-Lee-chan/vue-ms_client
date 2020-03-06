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
    <el-form ref="sparePartForm"
      :model="sparePartForm" :rules="rules" label-width="90px" size="small">
      <el-row>
        <el-col :xs="{offset: 4, span: 16}" :sm="{offset: 1, span: 9}">
          <el-form-item prop="name" label="备件名称:">
            <el-input v-model="sparePartForm.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="{offset: 4, span: 16}" :sm="{offset: 3, span: 9}">
          <el-form-item prop="model" label="型号:">
            <el-input v-model="sparePartForm.model" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="{offset: 4, span: 16}" :sm="{offset: 1, span: 9}">
          <el-form-item prop="spces" label="规格:">
            <el-input v-model="sparePartForm.spces" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="{offset: 4, span: 16}" :sm="{offset: 3, span: 9}">
          <el-form-item prop="brand" label="品牌:">
            <el-input v-model="sparePartForm.brand" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="{offset: 4, span: 16}" :sm="{offset: 1, span: 9}">
          <el-form-item prop="price" label="单价:">
            <el-input-number v-model="sparePartForm.price" controls-position="right"
              :min="0" @change="handleChange">
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :xs="{offset: 4, span: 16}" :sm="{offset: 3, span: 9}">
          <el-form-item prop="num" label="数量:">
            <el-input-number v-model="sparePartForm.num" controls-position="right"
              :min="0" @change="handleChange">
            </el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="{offset: 4, span: 16}" :sm="{offset: 1, span: 9}">
          <el-form-item prop="unit" label="单位:">
            <el-input v-model="sparePartForm.unit" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="{offset: 4, span: 16}" :sm="{offset: 3, span: 9}">
          <el-form-item prop="total" label="总价:">
            <el-input-number v-model="sparePartForm.total" controls-position="right"
              :min="0" disabled>
            </el-input-number>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="{offset: 4, span: 16}" :sm="{offset: 1, span: 9}">
          <el-form-item prop="usage" label="用途:">
            <el-input v-model="sparePartForm.usage" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :xs="{offset: 10}" :sm="{offset: 15}">
          <el-form-item>
            <own-button @click="onSubmit('sparePartForm')">提交</own-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>
<script>
import { mapState } from 'vuex';
import moment from 'moment';
import { reqGetSparePart, reqUpdateSparePart, reqAddSparePart } from '../../api';

export default {
  data() {
    return {
      type: 'add',
      sparePartForm: {
        name: '',
        model: '',
        specs: '',
        brand: '',
        price: '',
        num: '',
        unit: '',
        total: '',
        usage: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入备件名称', trigger: 'blur' }
        ],
        model: [
          { required: true, message: '请输入备件型号', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入备件单价', trigger: 'blur' }
        ],
        num: [
          { required: true, message: '请输入采购数量', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState(['user']),
    cardTitle() {
      if (this.type === 'add') {
        return '申购备件'
      }
      return '编辑备件'
    }
  },
  mounted() {
    const { type, _id } = this.$route.query;
    this.type = type;
    if (type !== 'add') {
      this.getSparePart(_id);
    }
  },
  methods: {
    async getSparePart(_id) {
      const result = await reqGetSparePart(_id);
      if (result.status === 0) {
        const sparePart = result.data;
        this.sparePartForm = sparePart;
      } else {
        this.$message.error(result.msg);
      }
    },
    onSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        const sparePart = this.sparePartForm;
        sparePart.committer = this.user.username;
        sparePart.time = moment().format('YYYY/MM/DD');
        sparePart.status = '未确认';
        if (valid) {
          if (this.type === 'add') {
            const result = await reqAddSparePart(sparePart);
            if (result.status === 0) {
              this.$message.success('申购备件成功');
              this.$refs[formName].resetFields();
              this.$router.replace('/spare-part');
            } else {
              this.$message.error(result.msg);
            }
          } else {
            sparePart._id = this.$route.query._id;
            const result = await reqUpdateSparePart(sparePart);
            if (result.status === 0) {
              this.$message.success('编辑备件成功');
              this.$refs[formName].resetFields();
              this.$router.replace('/spare-part');
            } else {
              this.$message.error(result.msg);
            }
          }
        } else {
          return false;
        }
      });
    },
    handleChange() {
      const { num, price } = this.sparePartForm;
      if (num && price) {
        this.sparePartForm.total = num * price;
      } else {
        this.sparePartForm.total = '';
      }
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
