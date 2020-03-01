<template>
  <div class="login">
    <header class="login-header">
      <img src="../../assets/logo.png" alt="logo"/>
      <h1>管理系统</h1>
    </header>
    <section class="login-content">
      <h2>用户登录</h2>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="login-form">
        <el-form-item prop="username">
          <el-input
            v-model="ruleForm.username"
            type="text"
            autocomplte="off"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="ruleForm.password"
            type="password"
            autocomplete="off"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
          >
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            class="login-form-button"
            @click="submitForm('ruleForm')"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
import Vue from 'vue';
import { Button } from 'element-ui';
import { mapState, mapActions } from 'vuex';

Vue.component(Button.name, Button);

export default {
  data() {
    const validate = (rule, value, callback) => {
      if (!/^[a-zA-Z0-9_]+$/.test(value)) {
        const type = rule.field === 'username' ? '用户名' : '密码';
        callback(`${type}必须由英文、数字或下划线组成`);
      } else {
        callback();
      }
    }
    return {
      ruleForm: {
        username: 'admin',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名必须输入', trigger: 'blur' },
          { min: 4, max: 12, message: '用户名在 4 到 12 个字符', trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码必须输入', trigger: 'blur' },
          { min: 4, max: 12, message: '密码在 4 到 12 个字符', trigger: 'blur' },
          { validator: validate, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapState(['user', 'msg'])
  },
  methods: {
    ...mapActions(['login']),
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const user = this.ruleForm;
          this.$store.dispatch('login', user).then(() => {
            if (!this.user && this.msg) {
              console.log(this.msg);
              this.$message.error(this.msg);
            } else {
              this.$router.push('/');
            }
          })
        } else {
          this.$message.error('检验失败');
          return false;
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login {
  width: 100%;
  height: 100%;
  background-image: url('./images/bg.jpg');
  background-size: 100% 100%;
  .login-header {
    display: flex;
    align-items: center;
    height: 80px;
    background-color: rgba(21, 20, 13, 0.5);
    img {
      width: 40px;
      height: 40px;
      margin: 0 15px 0 50px;
    }
    h1 {
      font-size: 30px;
      color: white;
    }
  }
  .login-content {
    width: 400px;
    height: 300px;
    background-color: #fff;
    margin: 50px auto;
    padding: 20px 40px;
    h2 {
      text-align: center;
      font-size: 30px;
      font-weight: bold;
      margin-bottom: 20px;
    }
    .login-form {
      margin-top: 30px;
      .login-form-button {
        width: 100%;
      }
    }
  }
}
</style>
