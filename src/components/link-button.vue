<script>
export default {
  name: 'link-button',
  render(h) {
    // 将 this.$slots 格式化为数组，因为 h 函数第三个参数是子节点，是一个数组
    const slots = Object.keys(this.$slots)
      .reduce((arr, key) => arr.concat(this.$slots[key]), [])
    return h('button', {
      on: this.$listeners,
      attrs: this.$attrs,
      props: this.$props,
      class: 'link-button'
    }, slots)
  }
}
</script>
<style lang="less" scoped>
.link-button {
  background-color: transparent;
  font-size: 14px;
  border: none;
  outline: none;
  color: #1da57a;
  cursor: pointer;
}
</style>
