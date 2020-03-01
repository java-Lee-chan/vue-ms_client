<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{role.name}}</span>
      <own-button style="float: right;" @click="handleClick">保存</own-button>
    </div>
    <div v-for="auths in authList" :key="auths.key" class="auth-item">
      <div class="auth-title">{{ auths.title }}</div>
      <el-row>
        <el-checkbox-group
          class="auth-group"
          v-model="menus[auths.title]"
          @change="$event => handleCheckedAuthChange($event, auths.title)"
        >
          <el-col :span="8" v-for="auth in auths.children"
            :key="auth.key">
            <el-checkbox :label="auth.key">
              {{ auth.title }}
            </el-checkbox>
          </el-col>
        </el-checkbox-group>
      </el-row>
    </div>
  </el-card>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import authList from '../../config/authConfig';
import { reqUpdateRole } from '../../api';

export default {
  props: {
    role: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      authList: [],
      menus: {}
    }
  },
  computed: {
    ...mapState(['user'])
  },
  created() {
    const menus = {};
    authList.forEach((auth) => {
      menus[auth.title] = [];
      // eslint-disable-next-line
      this.role.menus && this.role.menus.forEach((item) => {
        if (item.indexOf(auth.key) === 0) {
          menus[auth.title].push(item);
        }
      })
    });
    this.menus = menus;
  },
  mounted() {
    this.authList = authList;
  },
  methods: {
    ...mapActions(['logout']),
    handleCheckedAuthChange(value, key) {
      this.menus[key] = value;
    },
    async handleClick() {
      const { role } = this;
      role.menus = this.menus;
      role.auth_name = this.user.username;

      // 请求更新
      const result = await reqUpdateRole(role);
      if (result.status === 0) {
        // console.log(role._id, this.props.user);
        if (role._id === this.user.role_id) {
          this.logout();
          this.$message.warning('当前用户角色权限修改，请重新登录');
        } else {
          this.$message.success('设置角色权限成功');
        }
      } else {
        this.$message.error(result.msg);
      }
    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  min-height: 100%;
  .el-card__header {
    .clearfix {
      line-height: 27px;
      .own-button {
        transform: translateY(-4.5px);
      }
    }
  }
  .el-card__body {
    .auth-item {
      margin: 4px;
      font-size: 14px;
      .auth-title {
        padding: 12px 24px;
        border-bottom: 1px solid #ccc;
      }
      .el-row {
        padding: 16px 24px;
      }
    }
  }
}
</style>
