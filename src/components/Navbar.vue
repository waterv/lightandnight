<template>
  <van-sticky>
    <van-nav-bar v-if="canReturn" :title="title" left-text="返回" left-arrow @click-left="returnHomepage" />
    <van-nav-bar v-else :title="title" />
    <slot />
  </van-sticky>
</template>

<script>
import { NavBar, Sticky } from 'vant'

export default {
  name: 'Navbar',
  components: {
    [NavBar.name]: NavBar,
    [Sticky.name]: Sticky,
  },
  props: {
    title: String,
    canReturn: Boolean,
  },
  methods: {
    returnHomepage () {
      this.$router.push('/')
    },
  }
}
</script>