<template>
  <navbar :title="$t('route.statement')" can-return />

  <van-tabs v-model:active="active" scrollspy sticky offset-top="46">
    <div class="content">
      <van-tab :title="$t('statement.title[0]')">
        <h2 v-t="'statement.title[0]'" />
        <p v-for="i in [0, 1, 2]" :key="i" v-t="`statement.content[0][${i}]`" />
        <van-button
          type="danger"
          block
          @click="open('https://weibo.com/paandaa')"
        >
          <template #icon><weibo-icon height="12" fill="white" /></template>
          <template #default>{{ $t('statement.weibo') }}</template>
        </van-button>
        <van-button
          color="#25292e"
          block
          @click="open('https://github.com/waterv/lightandnight')"
        >
          <template #icon><git-hub height="12" fill="white" /></template>
          <template #default>{{ $t('statement.repo') }}</template>
        </van-button>
      </van-tab>
      <van-tab :title="$t('statement.title[1]')">
        <h2 v-t="'statement.title[1]'" />
        <p
          v-for="i in [0, 1, 2, 3]"
          :key="i"
          v-t="`statement.content[1][${i}]`"
        />
      </van-tab>
      <van-tab :title="$t('statement.title[2]')">
        <h2 v-t="'statement.title[2]'" />
        <p v-t="`statement.content[2][0]`" />
      </van-tab>
    </div>
  </van-tabs>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import WeiboIcon from '@/icons/Weibo.vue'
import GitHub from '@/icons/GitHub.vue'

export default {
  name: 'AboutAndStatement',
  components: {
    Navbar,
    WeiboIcon,
    GitHub,
  },
  data: () => ({
    active: 0,
  }),
  methods: {
    open(url) {
      window.open(url)
    },
  },
}
</script>

<style scoped>
.van-button + .van-button {
  margin-top: 5px;
}
</style>
