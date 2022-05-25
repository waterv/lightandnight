<template>
  <navbar title="404 Not Found" />
  <van-empty description="似乎走错路了……">
    <van-button type="primary" to="/">回到首页</van-button>
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
