<template>
  <van-nav-bar
    v-if="canReturn"
    :title="title"
    left-text="返回"
    left-arrow
    @click-left="returnHomepage"
    :fixed="!noFix"
    safe-area-inset-top
    placeholder
  >
    <template #right>
      <slot />
    </template>
  </van-nav-bar>
  <van-nav-bar
    v-else
    :title="title"
    :fixed="!noFix"
    safe-area-inset-top
    placeholder
  >
    <template #right>
      <slot />
    </template>
  </van-nav-bar>
</template>

<script>
import { NavBar, Toast } from 'vant'

export default {
  name: 'Navbar',
  components: {
    [NavBar.name]: NavBar,
    [Toast.name]: Toast,
  },
  props: {
    title: String,
    canReturn: Boolean,
    noFix: Boolean,
  },
  methods: {
    returnHomepage() {
      this.$router.push('/')
    },
  },
}
</script>
