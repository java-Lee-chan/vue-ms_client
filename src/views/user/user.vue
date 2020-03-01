<template>
  <el-card class="box-card">
    <div slot="header" class="card-header">
      <own-button @click="isShow=true"><i class="el-icon-plus"></i>创建用户</own-button>
    </div>
    <el-table
      :data="tableData"
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
      >
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <link-button
            size="mini"
            @click="handleUpdate(scope.row)"
          >
            修改
          </link-button>
            <link-button
              size="mini"
              @click="handleDelete(scope.row)"
            >
              删除
            </link-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="添加用户" width="520px" :visible.sync="isShow" @open="handleOpen">
      <user-form :roles="roles" :user="user" @setForm="setForm"></user-form>
      <div slot="footer">
        <el-button @click="handleCancel">取 消</el-button>
        <own-button @click="addOrUpdateUser">确 定</own-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
import { mapActions } from 'vuex';
import { reqGetUsers, reqDeleteUser } from '../../api';
import userForm from './user-form.vue';

export default {
  data() {
    return {
      tableData: [],
      columns: [],
      roleNames: [],
      roles: [],
      isShow: false,
      user: {},
    }
  },
  components: { userForm },
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
          // render: formatDate
        },
        {
          label: '所属角色',
          prop: 'role_id',
          // render: (role_id) => this.roleNames[role_id]
        },
      ]
    },
    async getUsers() {
      const result = await reqGetUsers();
      if (result.status === 0) {
        const { users, roles } = result.data;
        this.initRoleNames(roles);
        this.tableData = users;
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
    handleUpdate(user) {
      this.user = user;
      this.isShow = true;
    },
    handleDelete(user) {
      this.$confirm(`确定删除${user.username}吗`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const result = await reqDeleteUser(user._id);
        if (result.status === 0) {
          if (user._id === this.props.user._id) {
            this.$message.success('当前用户被删除请重新登录', 1);
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
    // handleOpen() {
    //   this.$nextTick(() => {
    //     if (this.refForm) {
    //       console.log(222);
    //       this.refForm.resetFields();
    //     }
    //   });
    // },
    // handleCancel() {
    //   this.isShow = false;
    // },
    // addOrUpdateUser() {

    // },
    // setForm(form, refForm) {
    //   this.form = form;
    //   this.refForm = refForm;
    //   console.log(111);
    // }
  }
}
</script>
<style lang="less" scoped>
.box-card {
  min-height: 100%;
  .el-card__header {
    height: 64px;
  }
}
</style>
