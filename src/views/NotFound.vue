<template>
  <navbar :title="$t('route.notfound')" />
  <van-empty :description="$t('common.notfound')">
    <van-button type="primary" to="/">{{ $t('common.back') }}</van-button>
  </van-empty>
</template>

<script>
import { Empty } from 'vant'
import Navbar from '@/components/Navbar.vue'
export default {
  name: 'NotFound',
  components: {
    [Empty.name]: Empty,
    Navbar,
  },
}
</script>
