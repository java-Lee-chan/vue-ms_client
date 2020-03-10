<template>
  <div>
    <el-table
      :data="meterLevels[type]"
      row-key="_id"
      border
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
      <el-table-column label="操作">
        <template slot-scope="scope">
          <link-button
            size="mini"
            :disabled="scope.row.father_id ? false : true"
            @click="handleMethod(scope.row, 'update')"
          >
            编辑
          </link-button>
          <el-dropdown>
            <link-button class="el-dropdown-link">
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </link-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                @click.native="handleMethod(scope.row, 'addLowerLevel')"
              >
                新建下级
              </el-dropdown-item>
              <el-dropdown-item
                :disabled="scope.row.father_id ? false : true"
                @click.native="handleMethod(scope.row, 'addSameLevel')"
              >
                新建平级
              </el-dropdown-item>
              <el-dropdown-item
                :disabled="scope.row.father_id ? false : true"
                @click.native="handleDelete(scope.row)"
              >
                删除
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      :title="dialogTitle"
      width="520px"
      :visible.sync="show"
    >
      <el-form
        :model="meterForm"
        :rules="rules"
        label-width="110px"
        ref="meterForm"
        size="small"
        style="padding: 0 60px 0 30px;"
      >
        <el-form-item prop="name" label="表层级名称:">
          <el-input v-model="meterForm.name" autocomplete="off" placeholder="请输入表的层级名称"></el-input>
        </el-form-item>
        <el-form-item prop="meterId" label="对应的表:">
          <el-select
            v-model="meterForm.meterId"
            autocomplete="off"
            placeholder="请关联对应的表"
            :clearable="true"
          >
            <el-option v-for="meter in meters"
              :key="meter._id"
              :value="meter._id"
              :label="meter.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="remark" label="备注:">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入备注"
            v-model="meterForm.remark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleCancel">取 消</el-button>
        <own-button @click="handleSubmit('meterForm')">确 定</own-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  reqGetMeterLevel,
  reqAddMeterLevel,
  reqUpdateMeterLevel,
  reqDeleteMeterLevel
} from '../../../api'
import { translateDataToTree } from '../../../utils/translateDataToTree';

export default {
  data() {
    return {
      columns: [],
      type: 'gas',
      meters: [],
      meterLevels: {},
      meterLevel: {},
      show: false,
      method: '',
      meterForm: {
        name: '',
        meterId: '',
        remark: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入表的层级名称', trigger: 'blur' },
        ]
      }
    }
  },
  beforeMount() {
    this.initColumns();
  },
  mounted() {
    this.getMeterLevel();
    this.meters = [
      {
        _id: '1',
        name: '1#INJ',
        type: 'water',
      },
      {
        _id: '2',
        name: '2#INJ',
        type: 'water'
      },
      {
        _id: '3',
        name: '1#R/B',
        type: 'water'
      },
      {
        _id: '4',
        name: '2#R/B',
        type: 'water'
      },
      {
        _id: '5',
        name: '1#无缝',
        type: 'water'
      },
      {
        _id: '6',
        name: '2#无缝',
        type: 'water'
      },
      {
        _id: '7',
        name: '1#INJ',
        type: 'elec'
      },
      {
        _id: '8',
        name: '2#INJ',
        type: 'elec'
      },
      {
        _id: '9',
        name: '1#R/B',
        type: 'elec'
      },
      {
        _id: '10',
        name: '2#R/B',
        type: 'elec'
      },
      {
        _id: '11',
        name: '1#无缝',
        type: 'elec'
      },
      {
        _id: '12',
        name: '2#无缝',
        type: 'elec'
      },
      {
        _id: '13',
        name: '1#INJ',
        type: 'gas'
      },
      {
        _id: '14',
        name: '2#INJ',
        type: 'gas'
      },
      {
        _id: '15',
        name: '1#R/B',
        type: 'gas'
      },
      {
        _id: '16',
        name: '2#R/B',
        type: 'gas'
      },
      {
        _id: '17',
        name: '1#无缝',
        type: 'gas'
      },
      {
        _id: '18',
        name: '2#无缝',
        type: 'gas'
      }
    ];
  },
  computed: {
    dialogTitle() {
      const { method } = this;
      switch (method) {
        case 'addLowerLevel':
          return '新增下级';
        case 'addSameLevel':
          return '新增平级';
        case 'update':
          return '编辑表层级';
        default:
          return '新增下级';
      }
    }
  },
  watch: {
    // eslint-disable-next-line
    '$route.params': {
      // eslint-disable-next-line
      handler: function (value) {
        this.type = value.type;
      },
      immediate: true
    }
  },
  methods: {
    initColumns() {
      this.columns = [
        {
          label: '表层级',
          prop: 'name',
          width: '300'
        },
        {
          label: '对应表',
          prop: 'relateMeter',
          width: '200'
        },
        {
          label: '类型',
          prop: 'type',
          width: '100'
        },
        {
          label: '备注',
          prop: 'remark',
        },
      ];
    },
    async getMeterLevel() {
      const result = await reqGetMeterLevel();
      if (result.status === 0) {
        const meterLevels = {};
        translateDataToTree(result.data).forEach((item) => {
          meterLevels[item.type] = [item];
        });
        this.meterLevels = meterLevels;
        console.log(meterLevels);
      } else {
        this.$message.error(result.msg);
      }
    },
    handleMethod(row, method) {
      this.show = true;
      this.method = method;
      this.meterLevel = row;
      if (method === 'update') {
        this.meterForm = row;
      } else {
        this.meterForm = {
          name: '',
          meterId: '',
          remark: ''
        }
      }
    },
    handleDelete(row) {
      this.$confirm(`确认删除${row.name}及其子层级吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const result = await reqDeleteMeterLevel(row._id);
        if (result.status === 0) {
          this.getMeterLevel();
          this.$message.success(`删除${row.name}这个表层级成功`);
        } else {
          this.$message.error(result.msg);
        }
      });
    },
    handleSubmit(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const newMeter = this.meterForm;
          let result = null;
          if (this.method === 'addLowerLevel') {
            newMeter.father_id = this.meterLevel._id;
            newMeter.type = this.type;
            result = await reqAddMeterLevel(newMeter);
          } else if (this.method === 'addSameLevel') {
            newMeter.father_id = this.meterLevel.father_id;
            newMeter.type = this.type;
            result = await reqAddMeterLevel(newMeter);
          } else if (this.method === 'update') {
            newMeter._id = this.meterLevel._id;
            result = await reqUpdateMeterLevel(newMeter);
          }
          if (result.status === 0) {
            this.getMeterLevel();
            this.show = false;
          } else {
            this.$message.error(result.msg);
          }
        }
      });
    },
    handleCancel() {
      this.show = false;
    }
  }
}
</script>
<style>

</style>
