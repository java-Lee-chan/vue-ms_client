<template>
  <el-form
    :model="form"
    :rules="rules"
    size="small"
    label-width="auto"
    ref="form"
    style="padding: 0 30px;"
  >
    <el-form-item prop="username" label="用户名:">
      <el-input v-model="form.username" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item prop="password" label="密码:">
      <el-input v-model="form.password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item prop="email" label="邮箱:">
      <el-input v-model="form.email" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item prop="phone" label="电话:">
      <el-input v-model="form.phone" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item prop="role_id" label="所属角色:">
      <el-input v-model="form.role_id" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
</template>
<script>
export default {
  props: {
    roles: {
      type: Array,
      required: true
    },
    user: {
      type: Object
    }
  },
  data() {
    return {
      rules: {
        username: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
        ],
        phone: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
        ],
        role_id: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
        ],
      },
      // form: this.user || {
      //   username: '',
      //   password: '',
      //   email: '',
      //   phone: '',
      //   role_id: ''
      // }
    }
  },
  mounted() {
    this.$emit('setForm', this.form, this.$refs.form);
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // const roleName = this.form.name;
          // this.$refs[formName].resetFields();
          // const result = await reqAddRole(roleName);
          // if (result.status === 0) {
          //   this.$message.success('添加用户成功');
          //   this.isShowAdd = false
          //   this.getRoles();
          // } else {
          //   this.$message.error(result.msg);
          // }
          // this.$emit('setForm', this.form, this.$refs[formName]);
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
  }
}
</script>
<style>

</style>
