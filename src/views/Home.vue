<template>
  <navbar title="光夜小工具">
    <van-icon v-if="active == 'events'" name="question-o" @click="showInfo" />
  </navbar>

  <div class="home">
    <template v-if="active == 'events'">
      <template v-for="v in events" :key="v">
        <van-cell-group v-if="!v.noavailable" :title="v.name" inset>
          <template v-for="u in v.events" :key="u">
            <van-cell
              v-if="u.time !== undefined"
              :title="u.name"
              :label="u.desc"
              center
            >
              <template #right-icon>
                <van-count-down :time="u.time">
                  <template #default="timeData">
                    <span class="block" :style="{ backgroundColor: u.color }">{{
                      timeData.days
                    }}</span
                    ><small>d</small>
                    <span class="block" :style="{ backgroundColor: u.color }">{{
                      timeData.hours
                    }}</span
                    ><small>h {{ u.state }}</small>
                  </template>
                </van-count-down>
              </template>
            </van-cell>
          </template>
        </van-cell-group>
      </template>
    </template>

    <template v-if="active == 'calculators'">
      <template v-for="v in tools" :key="v">
        <van-divider>{{ v.name }}</van-divider>
        <div class="content">
          <van-button
            v-for="u in v.children"
            :key="u"
            block
            :to="u.to"
            :color="u.background"
            :style="u.color ? `color: ${u.color} !important;` : ''"
          >
            {{ u.name }}
          </van-button>
        </div>
      </template>
    </template>

    <template v-if="active == 'settings'">
      <van-cell-group title="实验性功能" inset>
        <van-cell title="欧皇模拟器" is-link to="/common/image" />
      </van-cell-group>
      <van-cell-group title=" " inset>
        <van-cell
          title="清空 localStorage"
          label="清除后，一些设置项将回到默认值。"
          @click="clearLocalStorage"
          is-link
          center
        />
      </van-cell-group>
      <van-cell-group title=" " inset>
        <van-cell title="添加到主屏幕" is-link to="/posts/addtohome" />
        <van-cell title="关于与声明" is-link to="/posts/statement" />
        <van-cell title="更新日志" is-link to="/posts/changelog" />
      </van-cell-group>
    </template>
  </div>

  <van-tabbar v-model="active" @change="onActiveChange">
    <van-tabbar-item name="events" icon="calendar-o">活动提醒</van-tabbar-item>
    <van-tabbar-item name="calculators" icon="apps-o">实用工具</van-tabbar-item>
    <van-tabbar-item name="settings" icon="setting-o">设置</van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { CountDown, Tabbar, TabbarItem, Toast } from 'vant'
import Navbar from '@/components/Navbar.vue'
let dayjs = require('dayjs')

export default {
  name: 'App',
  components: {
    [CountDown.name]: CountDown,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    Navbar,
  },
  data() {
    let events = require('@/assets/data/events.json')
    let now = dayjs()
    for (let i in events) {
      let count = 0
      for (let j in events[i].events) {
        let v = events[i].events[j]
        if (v.periodic) {
          count += 1
          let target = dayjs()
            .tz()
            .day(v.day)
            .hour(0)
            .minute(0)
            .second(0)
            .millisecond(0)

          if (v.state == '始') target = target.hour(5)
          if (now.day() >= v.day) target = target.add(1, 'week')
          v.time = target.diff(now)
          v.color =
            v.state == '止' && v.time <= 86400000
              ? 'var(--van-red)'
              : 'var(--van-gray-7)'
        } else {
          let start = dayjs.tz(v.start)
          if (now.isBefore(start)) {
            count += 1
            v.time = start.diff(now)
            v.state = '始'
            v.color = 'var(--van-blue)'
          } else {
            let end = dayjs.tz(v.end)
            if (now.isBefore(end)) {
              count += 1
              v.time = end.diff(now)
              v.state = '止'
              v.color =
                v.time <= 86400000 ? 'var(--van-red)' : 'var(--van-green)'
            }
          }
        }
      }
      if (count == 0) events[i].noavailable = true
    }

    return {
      active: this.$root.homepageActive,
      infoShow: false,
      events,
      tools: [
        {
          name: '抽卡模拟',
          children: [
            {
              name: '信使花园模拟器',
              background: this.$root.colors.common.gacha,
              to: '/common/gacha',
            },
            {
              name: '羁梦星愿模拟器',
              background: this.$root.colors.events.wish,
              to: '/events/wish/sim',
            },
          ],
        },
        {
          name: '通用工具',
          children: [
            {
              name: '囤囤鼠计算器',
              background: this.$root.colors.common.hoard,
              color: 'rgba(69, 90, 100, .8)',
              to: '/common/hoard',
            },
            {
              name: '礼包性价比计算器',
              background: this.$root.colors.common.cpr,
              color: 'rgba(85, 76, 60, .8)',
              to: '/common/cpr',
            },
            {
              name: '灵犀养成计算器',
              background: this.$root.colors.common.level,
              color: 'rgba(109, 46, 43, 0.8)',
              to: '/common/level',
            },
            {
              name: '道具合成计算器',
              background: this.$root.colors.common.item,
              color: 'rgba(78, 68, 91, 0.8)',
              to: '/common/item',
            },
          ],
        },
        {
          name: '限时活动',
          children: [
            {
              name: '羁梦星愿计算器',
              background: this.$root.colors.events.wish,
              to: '/events/wish',
            },
          ],
        },
      ],
    }
  },
  methods: {
    showInfo() {
      this.$dialog.alert({
        ...this.$root.dialogSettings,
        message:
          '本页展示当前游戏中，各活动的大约开始或结束时间。\n\n因为活动结束常常伴随停服维护，结束时间按 00:00 而非 04:59 计。\n\n信息可能过时或不准确，请以游戏中实际情况为准。',
      })
    },
    onActiveChange(active) {
      this.$root.homepageActive = active
    },
    clearLocalStorage() {
      localStorage.clear()
      Toast({ message: 'localStorage 已清空。', icon: 'passed' })
    },
  },
}
</script>

<style scoped>
.home {
  padding-bottom: 54px;
}

.block {
  display: inline-block;
  width: 22px;
  margin: 0 2px;
  color: white;
  font-size: 12px;
  text-align: center;
  border-radius: 4px;
}

.van-theme-dark .block {
  filter: brightness(0.8);
}

.van-button {
  margin: 5px 0;
}

.van-theme-dark .van-button {
  filter: brightness(0.8);
}
</style>
