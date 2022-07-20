<template>
  <van-count-down :time="time">
    <template #default="timeData">
      <span class="block"> {{ timeData.days }} </span>
      <small>d</small>
      <span class="block"> {{ timeData.hours }} </span>
      <small>h {{ state }}</small>
    </template>
  </van-count-down>
</template>

<script>
import { CountDown } from 'vant'
export default {
  name: 'CountDown',
  props: {
    time: Number,
    state: String,
  },
  components: {
    [CountDown.name]: CountDown,
  },
}
</script>

<style scoped>
.block {
  display: inline-block;
  width: 22px;
  margin: 0 2px;
  color: white;
  font-size: 12px;
  text-align: center;
  border-radius: 4px;
}

.periodic .block {
  background-color: var(--van-gray-7);
}

.coming .block {
  background-color: var(--van-blue);
}

.started .block {
  background-color: var(--van-green);
}

.urgent .block {
  background-color: var(--van-red) !important;
}
</style>
