<template>
  <van-cell
    :class="{ top }"
    :title="name"
    :label="message"
    :center="message === undefined"
    size="large"
    clickable
  >
    <template #icon>
      <van-badge class="avatar-container" :content="badge">
        <van-icon class="avatar" :name="avatar" size="50" />
      </van-badge>
    </template>
    <template v-if="level" #extra>
      <van-circle
        :current-rate="progress || 0"
        :rate="100"
        size="50px"
        color="#ee8f97"
        layer-color="#d6d6d6"
      >
        <div class="level number">{{ level }}</div>
        <div class="level desc"><small v-t="'phone.contact.level'" /></div>
      </van-circle>
    </template>
  </van-cell>
</template>

<script>
import { Badge } from 'vant'

export default {
  name: 'PhoneCell',
  components: {
    [Badge.name]: Badge,
  },
  props: {
    name: String,
    message: String,
    avatar: String,
    top: Boolean,
    badge: Number,
    level: Number,
    progress: Number,
  },
}
</script>

<style scoped>
.top {
  background-color: var(--van-gray-1);
}

.top:active {
  background-color: var(--van-cell-active-color) !important;
}

.van-theme-dark .top {
  background-color: var(--van-gray-8);
}

.avatar-container {
  margin-right: var(--van-cell-horizontal-padding);
}

.avatar {
  border-radius: 5px;
  overflow: hidden;
}

.level {
  line-height: 14px;
  color: #ee8f97;
}

.level.number {
  padding-top: 11px;
}

.level.desc {
  padding-bottom: 11px;
}
</style>
