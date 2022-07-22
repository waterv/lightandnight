<template>
  <van-nav-bar
    :title="title"
    fixed
    safe-area-inset-top
    placeholder
    :left-text="canReturn ? $t('common.back') : undefined"
    :left-arrow="canReturn"
    @click="click"
    @click-left="leftClick"
    @click-right="rightClick"
  >
    <template #right>
      <van-icon v-if="hint" name="question-o" />
      <slot v-else />
    </template>
  </van-nav-bar>
</template>

<script>
import { NavBar, showDialog } from 'vant'

export default {
  name: 'MyNavbar',
  components: {
    [NavBar.name]: NavBar,
  },
  props: {
    title: String,
    canReturn: Boolean,
    hint: String,
    clickRight: Function,
  },
  data: () => ({
    count: 0,
  }),
  methods: {
    leftClick() {
      if (this.canReturn) this.$router.back()
    },
    rightClick(args) {
      if (this.hint)
        showDialog({
          ...this.$root.dialogSettings,
          message: this.$t(`hint.${this.hint}`),
        })
      else if (this.clickRight) this.clickRight(args)
    },
    click() {
      if (!this.canReturn && ++this.count > 10) this.$root.developerMode = true
    },
  },
}
</script>
