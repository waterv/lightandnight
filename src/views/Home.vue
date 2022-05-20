<template>
  <navbar title="光夜小工具" />

  <van-notice-bar left-icon="clock-o" color="#1989fa" background="#ecf9ff">
      <template v-for="v in events" :key="v">
        <template v-if="v.status">
          {{v.name}}将在约<van-count-down class="countdown" :time="v.countdown" format=" DD 天 HH 小时" />后{{v.status == 1 ? '开始' : '结束'}}。
        </template>
      </template>
  </van-notice-bar>

  <van-divider>通用工具</van-divider>
  <div class="content">
    <van-button block to="/common/hoard" id="hoard" color="linear-gradient(135deg, #bbe0f5, #e0f8e0)">囤囤鼠计算器</van-button>
    <van-button block to="/common/gacha" color="linear-gradient(135deg, #91c4cc, #b7ddc0)">信使花园模拟器</van-button>
    <van-button block to="/common/cpr" id="cpr" color="linear-gradient(135deg, #fbe9c3, #e6d8be)">礼包性价比计算器</van-button>
    <van-button block to="/common/item" id="item" color="linear-gradient(135deg, #f3d7d3, #c4c7e8)">道具合成计算器</van-button>
  </div>

  <van-divider>限时活动</van-divider>
  <div class="content">
    <van-button block to="/events/wish" color="linear-gradient(135deg, #6c71c5, #93a9da)">「羁梦星愿」计算器</van-button>
  </div>
</template>

<script>
import { CountDown } from 'vant'
import Navbar from '@/components/Navbar.vue'

let dayjs = require('dayjs')
let event = require('@/assets/data/event.json')
export default {
  name: 'App',
  components: {
    Navbar,
    [CountDown.name]: CountDown,
  },
  data () {
    let events = [
      ...event,
      {
        name: '本周「星座研究」',
        start: '2000-01-01',
        end: dayjs().add(1, 'week').day(0).format('YYYY-MM-DD')
      },
      {
        name: '下次「织梦迷境」',
        start: (dayjs().day() <= 3 ? dayjs().day(4).format('YYYY-MM-DD') : dayjs().add(1, 'week').day(4).format('YYYY-MM-DD')) + ' 05:00',
        end: '9999-12-31'
      },
    ]

    for (let i in events) {
      let date = dayjs()
      if (date.isBefore(events[i].start)) {
        events[i].status = 1
        events[i].countdown = dayjs.tz(events[i].start).diff(date)
      } else if (date.isBefore(events[i].end)) {
        events[i].status = 2
        events[i].countdown = dayjs.tz(events[i].end).diff(date)
      }
    }
    return {
      events
    }
  }
}
</script>

<style scoped>
.countdown {
  display: inline;
  color: unset;
}

#hoard {
  color: rgba(69, 90, 100, .8) !important;
}

#cpr {
  color: rgba(85, 76, 60, .8) !important
}

#item {
  color: rgba(78, 68, 91, 0.8) !important
}

.van-button {
  margin: 5px 0;
}

.notice-swipe {
  height: 40px;
  line-height: 40px;
}
</style>