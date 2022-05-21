<template>
  <navbar title="囤囤鼠" can-return />

  <van-cell-group inset title="攻略">
    <van-cell title="说明" label="本工具计算预计可攒到小熊星座的数目时，所有项目统一按照「每周期第一天就发放奖励」的规则参与计算，与实际情况存在偏差（如「每月签到」只在累积签满 x6 天才能得到羽毛笔），仅供粗略计算之用。目标日期越远，计算结果会越准确。" />
    <van-cell title="签到活动汇总" url="https://weibo.com/2304898581/Lp8uxiSt3" is-link center />
  </van-cell-group>

  <van-cell-group inset title="月卡">
    <template v-for="(v, i) in card" :key="i">
      <van-cell :title="`「${v.name}」已开通`" :label="`${v.count}/d・${v.aka}・${v.desc}`" center>
        <template #right-icon>
          <van-switch v-model="v.on" size="24" />
        </template>
      </van-cell>
      <van-cell v-if="v.on" :title="`「${v.name}」过期时间`" :value="v.decString" clickable @click="showCalendar(i)" />
    </template>
  </van-cell-group>

  <van-cell-group v-for="(v, i) in data" :key="i" inset :title="v.name + '常'">
    <van-cell v-for="(u, j) in v.value" :key="j" :title="u.name" :label="`${u.count}${u.desc ? `・${u.desc}` : ''}`" center>
      <template #right-icon>
        <van-switch v-model="u.on" size="24" />
      </template>
    </van-cell>
    <van-field v-model="v.other" type="number" label="其他" :placeholder="`其他每${v.name}固定得到的小熊星座数`" autocomplete="off" />
  </van-cell-group>

  <van-cell-group inset title="当前状态">
    <van-field v-model="currentCoin" type="number" label="小熊星座" autocomplete="off" />
    <van-field v-model="currentGachapon" type="number" label="羽毛笔" autocomplete="off" />
    <van-field v-model="currentGachapon10" type="number" label="十连签收券" autocomplete="off" />
    <van-cell title="目标日期" :value="targetDateString" clickable @click="showCalendar(-1)" />
  </van-cell-group>

  <van-cell-group inset title="计算结果">
    <van-cell title="预计可攒到小熊（折合）" :value="coin" />
    <van-cell title="预计可攒到抽数（折合）" :value="gacha" />
  </van-cell-group>

  <van-calendar v-model:show="calendarShow" @confirm="calendarConfirm" :min-date="startDate" :show-confirm="false" />
</template>

<script>
import Navbar from '@/components/Navbar.vue'
let dayjs = require('dayjs')

export default {
  name: 'CPR',
  components: { Navbar },
  data () {
    return {
      card: [
        { name: '超值月卡', aka: '小月卡', desc: '游戏内 30 元开通', count: 150, on: false, dec: undefined, decString: '不过期' },
        { name: '悦享卡', aka: '大月卡', desc: '心悦俱乐部 98 元开通', count: 300, on: false, dec: undefined, decString: '不过期' },
        { name: '限定巡礼', aka: '季卡/年卡', desc: '活动 60 元开通', count: 100, on: false, dec: undefined, decString: '不过期' },
      ],
      data: {
        daily: {
          name: '日',
          unit: 'day',
          value: [
            { name: '日常全勤', desc: '今日计划、星光展馆、商店 5 区', count: 120, on: true  },
            { name: 'QQ 游戏中心', desc: '每日登录礼包、启动特权礼包', count: 6, on: false },
          ],
          other: undefined,
        },
        weekly: {
          name: '周',
          unit: 'week',
          value: [
            { name: '星座研究', count: 800, on: true  },
            { name: 'QQ 游戏中心', desc: '每周登陆礼包', count: 10, on: false },
            { name: '心悦俱乐部', desc: '每周签到第一天', count: 30, on: false },
            { name: '掌上道聚城', desc: '道具兑换、周五六签到、互助', count: 215, on: false },
          ],
          other: undefined,
        },
        monthly: {
          name: '月',
          unit: 'month',
          value: [
            { name: '本月签到', desc: 'x6 日羽毛笔折合', count: 900, on: true  },
            { name: '签到链接', desc: '第六、七天折合，按每月两次计', count: 1200, on: false },
            { name: 'QQ 游戏中心', desc: '道具兑换、每月登录礼包', count: 40, on: false },
          ],
          other: undefined,
        },
      },
      currentCoin: undefined,
      currentGachapon: undefined,
      currentGachapon10: undefined,
      currentCalendar: 0,
      calendarShow: false,
      startDate: dayjs().toDate(),
      targetDate: dayjs().add(1, 'month').toDate(),
      targetDateString: dayjs().add(1, 'month').format('M 月 D 日'),
    }
  },
  computed: {
    coin () {
      let date = dayjs(this.targetDate)
      let result = this.currentCoin ? Number(this.currentCoin) : 0
      result += (this.currentGachapon ? Number(this.currentGachapon) : 0) * 300
      result += (this.currentGachapon10 ? Number(this.currentGachapon10) : 0) * 3000

      for (let i in this.card) {
        if (this.card[i].on) {
          let times = Math.ceil(date.diff(dayjs(), 'day', true))
          if (this.card[i].dec)
            times = Math.min(times, Math.ceil(dayjs(this.card[i].dec).diff(dayjs(), 'day', true)))
          result += times * this.card[i].count
        }
      }

      for (let i in this.data) {
        let times = Math.ceil(date.diff(dayjs(), this.data[i].unit, true))
        let pertime = this.data[i].other ? Number(this.data[i].other) : 0
        for (let j in this.data[i].value) {
          if (this.data[i].value[j].on)
            pertime += this.data[i].value[j].count
        }
        result += times * pertime
      }

      return result
    },
    gacha () {
      return Math.floor(this.coin / 300)
    }
  },
  methods: {
    showCalendar (i) {
      this.currentCalendar = i
      this.calendarShow = true
    },
    calendarConfirm (v) {
      let i = this.currentCalendar
      this.calendarShow = false
      if (i == -1) {
        this.targetDate = v
        this.targetDateString = dayjs(v).format('M 月 D 日')
      } else {
        this.card[i].dec = v
        this.card[i].decString = dayjs(v).format('M 月 D 日')
      }
    }
  }
}
</script>