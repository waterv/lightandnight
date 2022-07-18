<template>
  <van-nav-bar
    v-if="canReturn"
    :title="title"
    fixed
    safe-area-inset-top
    placeholder
    :left-text="$t('common.back')"
    left-arrow
    @click-left="back"
  >
    <template #right>
      <template v-if="hint">
        <van-icon name="question-o" @click="showInfo" />
      </template>
      <template v-else>
        <slot />
      </template>
    </template>
  </van-nav-bar>

  <van-nav-bar
    v-else
    :title="title"
    fixed
    safe-area-inset-top
    placeholder
    @click="developerMode"
  >
    <template #right>
      <template v-if="hint">
        <van-icon name="question-o" @click="showInfo" />
      </template>
      <template v-else>
        <slot />
      </template>
    </template>
  </van-nav-bar>
</template>

<script>
import { NavBar } from 'vant'

export default {
  name: 'Navbar',
  components: {
    [NavBar.name]: NavBar,
  },
  props: {
    title: String,
    canReturn: Boolean,
    hint: String,
  },
  data: () => ({
    count: 0,
  }),
  methods: {
    back() {
      this.$router.back()
    },
    showInfo() {
      this.$dialog.alert({
        ...this.$root.dialogSettings,
        message: this.$t(`hint.${this.hint}`),
      })
    },
    developerMode() {
      this.count += 1
      if (this.count > 10)
        this.$root.developerMode = true
    }
  },
}
</script>
