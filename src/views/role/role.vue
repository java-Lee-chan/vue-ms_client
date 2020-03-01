<template>
  <el-container class="role-container">
    <el-header>
      <own-button @click="isShowAdd=true">添加角色</own-button>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          @select="handleSelect"
          text-color="black"
          active-text-color="#1da57a"
          :default-active="role._id"
        >
          <el-menu-item
            v-for="role in roles"
            :key="role._id"
            :index="role._id"
          >
            {{ role.name }}
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 要在子组件的 created 生命周期中使用 menus，因为是异步的，所以最好等获取到 menus 再渲染子组件 -->
        <role-content v-if="role.menus" :role="role"></role-content>
      </el-main>
    </el-container>
    <el-dialog title="添加角色" width="520px" :visible.sync="isShowAdd">
      <el-form
        :model="form"
        :rules="rules"
        size="medium"
        label-width="auto"
        ref="form"
        style="padding: 0 30px;"
      >
        <el-form-item prop="name" label="角色名称:">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="isShowAdd = false">取 消</el-button>
        <own-button @click="submitForm('form')">确 定</own-button>
      </div>
    </el-dialog>
  </el-container>
</template>
<script>
import roleContent from './role-content.vue';
import { reqGetRoles, reqAddRole } from '../../api';

export default {
  data() {
    return {
      roles: [],
      role: {},
      isShowAdd: false,
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
      },
      form: {
        name: ''
      }
    }
  },
  components: {
    roleContent,
  },
  mounted() {
    this.getRoles();
  },
  methods: {
    async getRoles() {
      const result = await reqGetRoles();
      if (result.status === 0) {
        this.roles = result.data;
        this.role = this.roles[0] || {};
      } else {
        this.$message.error(result.msg);
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const roleName = this.form.name;
          this.$refs[formName].resetFields();
          const result = await reqAddRole(roleName);
          if (result.status === 0) {
            this.$message.success('添加角色成功');
            this.isShowAdd = false
            this.getRoles();
          } else {
            this.$message.error(result.msg);
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    handleSelect(index) {
      const newRole = this.roles.find((role) => role._id === index);
      this.role = newRole;
    }
  }
}
</script>
<style lang="less" scoped>
.role-container {
  background-color: #fff;
  min-height: 100%;
  .el-header {
    padding: 0 50px;
    border-bottom: 1px solid #ccc;
    height: 64px !important;
    line-height: 64px;
  }
  .el-aside {
    border-right: 1px solid #ccc;
    .el-menu-item {
      height: 40px;
      margin: 5px 0;
      line-height: 40px;
    }
    .el-menu-item.is-active {
      background-color: #D6E7E0;
      border-right: 3px solid #1da57a;
    }
  }
  .el-main {
    padding: 0px;
  }
}
</style>
