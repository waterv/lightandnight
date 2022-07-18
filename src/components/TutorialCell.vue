<template>
  <van-cell
    :title="$t(`tutorial.${message}[0]`)"
    :label="$t('tutorial.via', [$t(`tutorial.${message}[2]`), desc])"
    is-link
    center
    @click="openUrl"
  />
</template>

<script>
export default {
  name: 'TutorialCell',
  props: {
    message: String,
    desc: String,
  },
  methods: {
    openUrl() {
      window.open(this.$t(`tutorial.${this.message}[1]`))
    },
  },
}
</script>
