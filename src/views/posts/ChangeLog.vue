<template>
  <navbar :title="$t('route.posts.changelog')" can-return />

  <van-tabs v-model:active="active" scrollspy sticky offset-top="46">
    <div class="content">
      <van-tab
        v-for="version in logs"
        :key="version"
        :title="$t('changeLog.versionNumber', [version.year, version.week])"
      >
        <h2>{{ $t('changeLog.version', [version.year, version.week]) }}</h2>
        <template v-for="(items, side) in version.changes" :key="items">
          <h3 v-t="`changeLog.${side}`" />
          <ol>
            <li v-for="item in items" :key="item" v-html="item" />
          </ol>
        </template>
      </van-tab>
    </div>
  </van-tabs>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'ChangeLog',
  components: {
    Navbar,
  },
  data() {
    return {
      active: 0,
      logs: require('@/data/app/changeLog.json'),
    }
  },
}
</script>

<style scoped>
ol {
  padding-left: 40px;
  list-style: decimal;
}
</style>
