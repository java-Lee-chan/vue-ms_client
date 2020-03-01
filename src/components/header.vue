<template>
  <div class='header'>
    <div class="header-top">
      <span>欢迎，{{ user ? user.username : '' }}</span>
      <link-button @click="logout">退出</link-button>
    </div>
    <div class="header-bottom">
      <div class="header-bottom-left">{{title}}</div>
      <div class="header-bottom-right">
        <span>时间</span>
        <img src="" alt=""/>
        <span>天气</span>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
    }
  },
  computed: {
    ...mapState(['user', 'title'])
  },
  methods: {
    logout() {
      this.$confirm('确认退出吗', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('logout');
      });
    }
  },
}
</script>
<style lang="less" scoped>
.header {
  height: 60px;
  background-color: #fff;
  font-size: 14px;
  .header-top {
    height: 30px;
    line-height: 30px;
    padding-right: 30px;
    text-align: right;
    border-bottom: 1px solid #1da57a;
    span {
      margin-right: 10px;
      line-height: 17px;
    }
  }
  .header-bottom {
    height: 30px;
    display: flex;
    align-items: center;
    .header-bottom-left {
      line-height: 22px;
      width: 25%;
      text-align: center;
      font-size: 15px;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        right: 50%;
        top: 100%;
        transform: translateX(50%);
        border-top: 15px solid white;
        border-right: 15px solid transparent;
        border-bottom: 15px solid transparent;
        border-left: 15px solid transparent;
      }
    }
    .header-bottom-right {
      line-height: 21px;
      width: 75%;
      text-align: right;
      margin-right: 30px;
      img {
        margin: 0 15px;
        width: 20px;
        height: 15px;
      }
    }
  }
}
</style>
