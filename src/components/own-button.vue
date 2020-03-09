<script>
export default {
  name: 'ownButton',
  render(h) {
    // 将 this.$slots 格式化为数组，因为 h 函数第三个参数是子节点，是一个数组
    const slots = Object.keys(this.$slots)
      .reduce((arr, key) => arr.concat(this.$slots[key]), []);

    return h('el-button', {
      on: this.$listeners,
      attrs: {
        ...this.$attrs,
        size: 'medium'
      },
      props: this.$props,
      class: 'own-button'
    }, slots)
  }
}
</script>
<style lang="less">
.own-button {
  background-color: #1da57a;
  color: white;
}
</style>
