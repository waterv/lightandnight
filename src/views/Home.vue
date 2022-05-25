<template>
  <navbar title="光夜小工具">
    <van-icon name="question-o" @click="infoShow = true" />
  </navbar>

  <div class="home">
    <template v-if="active == 'events'">
      <van-cell-group title=" " inset>
        <van-cell title="介绍与声明" is-link to="/posts/statement" @click="onEnterPage" />
      </van-cell-group>
      <template v-for="v in event" :key="v">
        <van-cell-group v-if="!v.noavailable" :title="v.name" inset>
          <template v-for="u in v.events" :key="u">
            <van-cell v-if="u.time !== undefined" :title="u.name" center>
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

    <template v-if="active == 'calculator'">
      <template v-for="v in tool" :key="v">
        <van-divider>{{ v.name }}</van-divider>
        <div class="content">
          <van-button
            v-for="u in v.children"
            :key="u"
            block
            :to="u.to"
            :color="u.background"
            :style="u.color ? `color: ${u.color} !important;` : ''"
            @click="onEnterPage"
          >
            {{ u.name }}
          </van-button>
        </div>
      </template>
    </template>
  </div>

  <van-tabbar v-model="active" @change="onActiveChange">
    <van-tabbar-item name="events" icon="calendar-o">活动提醒</van-tabbar-item>
    <van-tabbar-item name="calculator" icon="apps-o">实用工具</van-tabbar-item>
    <van-tabbar-item name="gacha" icon="gift-card-o" to="/common/gacha"
      >抽卡模拟</van-tabbar-item
    >
  </van-tabbar>

  <van-action-sheet
    v-model:show="infoShow"
    :actions="infoActions"
    cancel-text="关闭"
    close-on-click-action
  />
</template>

<script>
import { ActionSheet, CountDown, Tabbar, TabbarItem, Toast } from 'vant'
import Navbar from '@/components/Navbar.vue'
let dayjs = require('dayjs')

export default {
  name: 'App',
  components: {
    [ActionSheet.name]: ActionSheet,
    [CountDown.name]: CountDown,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [Toast.name]: Toast,
    Navbar,
  },
  data() {
    let event = require('@/assets/data/events.json')
    let now = dayjs()
    for (let i in event) {
      let count = 0
      for (let j in event[i].events) {
        let v = event[i].events[j]
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
      if (count == 0) event[i].noavailable = true
    }

    return {
      active: this.$root.homepageActive,
      infoShow: false,
      infoActions: [
        {
          name: '功能「活动提醒」说明',
          callback: () =>
            this.$dialog.alert({
              ...this.$root.dialogSettings,
              message:
                '本页展示当前游戏中，各活动的大约开始或结束时间。\n\n因为活动结束常常伴随停服维护，结束时间按 00:00 而非 04:59 计。\n\n信息可能过时或不准确，请以游戏中实际情况为准。',
            }),
        },
        {
          name: '添加到主屏幕',
          callback: () => {
            this.$router.push('/posts/addtohome')
            this.onEnterPage()
          },
        },
        {
          name: '更新日志',
          callback: () => {
            this.$router.push('/posts/changelog')
            this.onEnterPage()
          },
        },
      ],
      event,
      tool: [
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
              name: '「羁梦星愿」计算器',
              background: this.$root.colors.events.wish,
              to: '/events/wish',
            },
          ],
        },
      ],
    }
  },
  methods: {
    onActiveChange(active) {
      if (active != 'gacha') this.$root.homepageActive = active
      else this.onEnterPage()
    },
    onEnterPage() {
      Toast.loading({
        message: '加载中…',
        forbidClick: true,
        duration: 0,
      })
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

.van-button {
  margin: 5px 0;
}
</style>
