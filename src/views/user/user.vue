<template>
  <el-card class="box-card">
    <div slot="header" class="card-header">
      <own-button @click="handleShowAdd"><i class="el-icon-plus"></i>创建用户</own-button>
    </div>
    <el-table
      :data="tableData.slice((currentPage - 1) * pagesize, currentPage*pagesize)"
      border
    >
      <el-table-column
        label="序号"
        type="index"
        align="center"
        width="55">
      </el-table-column>
      <el-table-column
        v-for="item in columns"
        :property="item.prop"
        :key="item.prop"
        :label="item.label"
        :formatter="item.formatter"
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <link-button
            size="mini"
            @click="handleShowUpdate(scope.row)"
          >
            修改
          </link-button>
            <link-button
              size="mini"
              @click="handleUserDelete(scope.row)"
            >
              删除
            </link-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="page-container">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-sizes="[10, 20, 30, 50, 100]"
        :total="total"
        :hide-on-single-page="true"
        @current-change="(currentPage) => this.currentPage = currentPage">
      </el-pagination>
    </div>
    <el-dialog
      :title="dialogTitle"
      width="520px"
      :visible.sync="show"
    >
      <el-form
        :model="form"
        :rules="rules"
        label-width="100px"
        ref="form"
        size="small"
        style="padding: 0 60px 0 30px;"
      >
        <el-form-item prop="username" label="用户名:">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="dialogTitle === '添加用户'" prop="password" label="密码:">
          <el-input v-model="form.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱:">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="电话:">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item prop="role_id" label="所属角色:">
          <el-select v-model="form.role_id" placeholder="请选择角色" style="width: 100%">
            <el-option v-for="role in roles"
              :key="role._id"
              :value="role._id"
              :label="role.name"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleCancel">取 消</el-button>
        <own-button @click="handleUserAddOrUpdate('form')">确 定</own-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import { reqGetUsers, reqAddOrUpdate, reqDeleteUser } from '../../api';
import { formatDate } from '../../utils/dateUtils';

export default {
  data() {
    const validateNameOrPwd = (rule, value, callback) => {
      if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        const type = rule.field === 'username' ? '用户名' : '密码';
        callback(`${type}必须由英文、数字或下划线组成`);
      } else {
        callback();
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (!/^\w+@[a-z0-9]+\.[a-z]{2,4}$/.test(value)) {
        callback('请输入正确的邮箱');
      } else {
        callback();
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!/^1\d{10}$/.test(value)) {
        callback('请输入正确的手机号');
      } else {
        callback();
      }
    }
    return {
      tableData: [],
      columns: [],
      roleNames: [],
      roles: [],
      total: 0,
      show: false,
      dialogTitle: '',
      rules: {
        username: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 4, max: 12, message: '用户名在4到12位之间', trigger: 'blur' },
          { validate: validateNameOrPwd, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 4, max: 12, message: '密码在4到12位之间', trigger: 'blur' },
          { validate: validateNameOrPwd, trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validate: validateEmail, trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { validate: validatePhone, trigger: 'blur' }
        ],
        role_id: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
      },
      form: {
        username: '',
        password: '',
        email: '',
        phone: '',
        role_id: '',
      },
      pagesize: 10,
      currentPage: 1
    }
  },
  computed: {
    ...mapState(['user'])
  },
  beforeMount() {
    this.initColumns();
  },
  mounted() {
    this.getUsers();
  },
  methods: {
    ...mapActions(['logout']),
    initColumns() {
      this.columns = [
        {
          label: '用户名',
          prop: 'username'
        },
        {
          label: '邮箱',
          prop: 'email'
        },
        {
          label: '电话',
          prop: 'phone',
        },
        {
          label: '注册时间',
          prop: 'create_time',
          formatter(row) {
            return formatDate(row.create_time);
          }
        },
        {
          label: '所属角色',
          prop: 'role_id',
          formatter: (row) => (this.roleNames[row.role_id])
        },
      ]
    },
    async getUsers() {
      const result = await reqGetUsers();
      if (result.status === 0) {
        const { users, roles } = result.data;
        this.initRoleNames(roles);
        this.tableData = users;
        this.total = users.length;
        this.roles = roles;
      } else {
        this.$message.error(result.msg);
      }
    },
    initRoleNames(roles) {
      const roleNames = roles.reduce((pre, role) => {
        const newPre = pre;
        newPre[role._id] = role.name;
        return newPre
      }, {});
      this.roleNames = roleNames;
    },
    // 添加用户
    handleShowAdd() {
      this.show = true;
      this.dialogTitle = '添加用户';
      this.form = {
        username: '',
        password: '',
        email: '',
        phone: '',
        role_id: '',
      };
    },
    // 编辑用户
    handleShowUpdate(user) {
      this.show = true;
      this.dialogTitle = '修改用户';
      this.form = JSON.parse(JSON.stringify(user));
    },
    // 删除用户
    handleUserDelete(currentUser) {
      this.$confirm(`确定删除${currentUser.username}吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const result = await reqDeleteUser(currentUser._id);
        if (result.status === 0) {
          if (currentUser._id === this.user._id) {
            this.$message.success('当前用户被删除请重新登录');
            this.logout();
          } else {
            this.$message.success('删除用户成功');
            this.getUsers();
          }
        } else {
          this.$message.error(result.msg);
        }
      });
    },
    handleCancel() {
      this.show = false;
    },
    handleUserAddOrUpdate(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          console.log('submit!');
          this.show = false;
          const newUser = this.form;
          const result = await reqAddOrUpdate(newUser);
          if (result.status === 0) {
            // 3. 更新列表显示
            if (newUser._id === this.user._id) {
              this.$message.success('修改当前用户的信息后需重新登录');
              this.logout();
            } else {
              this.$message.success(`${this.dialogTitle}成功`);
              this.getUsers();
              this.isShow = false;
            }
          } else {
            this.$message.error(result.msg);
          }
        } else {
          return false;
        }
      });
    }
  }
}
</script>
<style lang="less" scoped>
.box-card {
  min-height: 100%;
  .el-card__header {
    height: 64px;
  }
  .page-container {
    text-align: right;
    margin-top: 20px;
  }
}
</style>
