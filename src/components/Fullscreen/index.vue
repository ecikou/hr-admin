<template>
  <span @click="handleClick">
    <svg-icon icon-class="fullscreen" class="icon"></svg-icon>
  </span>
</template>

<script>
export default {
  filters: {},
  components: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () { },
  methods: {
    async handleClick () {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await document.documentElement.requestFullscreen()
      }

      // if (screenfull.isEnabled) {
      //   screenfull.request()
      // }
    }
  }
}
</script>

<style scoped lang='scss'>
.icon {
  color: #fff;
  font-size: 20px;
  margin-right: 20px;
}
</style>
