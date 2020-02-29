<template>
  <div v-if="item.children">
    <el-submenu :index="item.key">
      <template slot="title" >
        <i :class="`el-icon-${item.icon}`"></i>
        <span slot="title">{{item.title}}</span>
      </template>
      <template v-for="child in item.children">
        <navigation-item v-if="child.children&&child.children.length>0"
          :item="child"
          :key="child.key"/>
        <el-menu-item v-else @click="setHeadTitle(child.title)" :key="child.key" :index="child.key">
          <i :class="`el-icon-${child.icon}`"></i>
          <span slot="title">{{child.title}}</span>
        </el-menu-item>
      </template>
    </el-submenu>
  </div>
  <div v-else>
    <el-menu-item @click="setHeadTitle(item.title)" :key="item.key" :index="item.key">
      <i :class="`el-icon-${item.icon}`"></i>
      <span slot="title">{{item.title}}</span>
    </el-menu-item>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'navigationItem',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    ...mapActions(['setHeadTitle'])
  }
}
</script>
<style lang="less" scoped>
.el-menu-item {
  height: 40px;
  line-height: 40px;
  margin-bottom: 8px;
}
.el-menu-item.is-active {
  background-color: #1da57a!important;
}
</style>
