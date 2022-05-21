<template>
  <navbar title="光夜小工具" />

  <div class="home">
    <template v-if="active == 'events'">
      <van-cell-group inset title="说明">
        <van-cell title="说明" label="本页面提供当前游戏中各活动的大约开始或结束时间。因为活动结束常常伴随停服维护，结束时间按 00:00 而非 04:59 计。信息可能过时或不准确，请以游戏中实际情况为准。" />
        <van-cell title="游戏官方微博" is-link url="https://weibo.com/u/6880285576" />
      </van-cell-group>
      <template v-for="v in event" :key="v">
        <van-cell-group v-if="!v.noavailable" inset :title="v.name">
          <template v-for="u in v.events" :key="u">
            <van-cell v-if="u.time" :title="u.name" center>
              <template #right-icon>
                <span class="block" :style="{ backgroundColor: u.color }">{{u.time}}</span>h 后{{u.state}}
              </template>
            </van-cell>
          </template>
        </van-cell-group>
      </template>
    </template>

    <template v-if="active == 'calculator'">
      <van-divider>通用工具</van-divider>
      <div class="content">
        <van-button block to="/common/hoard" id="hoard" color="linear-gradient(135deg, #bbe0f5, #e0f8e0)">囤囤鼠计算器</van-button>
        <van-button block to="/common/cpr" id="cpr" color="linear-gradient(135deg, #fbe9c3, #e6d8be)">礼包性价比计算器</van-button>
        <van-button block to="/common/item" id="item" color="linear-gradient(135deg, #f3d7d3, #c4c7e8)">道具合成计算器</van-button>
      </div>

      <van-divider>限时活动</van-divider>
      <div class="content">
        <van-button block to="/events/wish" color="linear-gradient(135deg, #6c71c5, #93a9da)">「羁梦星愿」计算器</van-button>
      </div>

      <van-divider>广告时间</van-divider>
      <div class="content">
        <van-button block url="https://github.com/waterv/lightandnight" color="linear-gradient(135deg, #25292e, #353940)">本站的 GitHub 仓库</van-button>
      </div>
    </template>
  </div>

  <van-tabbar v-model="active" @change="onActiveChange">
    <van-tabbar-item name="events" icon="calendar-o">活动提醒</van-tabbar-item>
    <van-tabbar-item name="calculator" icon="apps-o">实用工具</van-tabbar-item>
    <van-tabbar-item name="gacha" icon="gift-card-o" to="/common/gacha">抽卡模拟</van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant'
import Navbar from '@/components/Navbar.vue'
let dayjs = require('dayjs')

export default {
  name: 'App',
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    Navbar,
  },
  data () {
    let event = require('@/assets/data/event.json')
    let now = dayjs()
    for (let i in event) {
      let count = 0
      for (let j in event[i].events) {
        let v = event[i].events[j]
        if (v.periodic) {
          count += 1
          let target = dayjs().day(v.day).hour(0).minute(0).second(0)
          if (v.state == '开始') target = target.hour(5)
          if (!now.isBefore(target)) target = target.add(1, 'week')
          v.time = target.diff(now, 'hour')
          v.color = 'var(--van-gray-7)'
        } else {
          let start = dayjs.tz(v.start)
          if (now.isBefore(start)) {
            count += 1
            v.time = start.diff(now, 'hour')
            v.state = '开始'
            v.color = 'var(--van-blue)'
          } else {
            let end = dayjs.tz(v.end)
            if (now.isBefore(end)) {
              count += 1
              v.time = end.diff(now, 'hour')
              v.state = '结束'
              v.color = (v.time <= 24) ? 'var(--van-red)' : 'var(--van-green)'
            }
          }
        }
      }
      if (count == 0) event[i].noavailable = true
    }

    return {
      event,
      active: this.$root.homepageActive,
    }
  },
  methods: {
    onActiveChange (active) {
      if (active != 'gacha')
        this.$root.homepageActive = active
    }
  }
}
</script>

<style scoped>
.home {
  padding-bottom: 54px;
}

.block {
  display: inline-block;
  width: 30px;
  margin-right: 4px;
  color: white;
  font-size: 12px;
  text-align: center;
  border-radius: 4px;
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
</style>