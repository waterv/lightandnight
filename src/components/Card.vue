<template>
  <van-col :offset="isSingle ? 6 : 0" span="12" :class="{'list': inList}">
    <van-badge :content="isNew ? 'New' : (count > 1 ? `${count - 1} 花` : undefined)"
      class="badge" :offset="[-12, 6]" color="rgba(187, 134, 68, .7)">
      <div class="card" :style="{'background': backgroundColor[star]}">
        {{name}}
        <div class="star">{{stars.slice(0, star)}}</div>
      </div>
    </van-badge>
  </van-col>
</template>

<script>
import { Badge } from 'vant'

export default {
  name: 'Card',
  components: {
    [Badge.name]: Badge,
  },
  props: {
    isSingle: Boolean,
    name: String,
    star: Number,
    isNew: Boolean,
    count: Number,
    inList: Boolean,
  },
  data () {
    return {
      stars: '★★★★★★',
      backgroundColor: {
        6: 'linear-gradient(135deg, #f5efcd, #ded19d)',
        5: 'linear-gradient(135deg, #f5e9f7, #cec6e0)',
        4: '#b4afc9',
        3: '#b5c6d8',
      },
    }
  }
}
</script>

<style scoped>
.badge {
  width: 100%;
}

.list {
  padding: 4px;
}

.card {
  padding: 8px;
  border-radius: 8px;
  color: var(--van-gray-8);
  text-align: center;
  text-shadow: 0 1px 2px var(--van-gray-2);
}

.star {
  color: #f4ebc4;
  text-shadow: 0 1px 2px rgba(0, 0, 0, .3);
}
</style>
