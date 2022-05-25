<template>
  <navbar title="囤囤鼠" can-return>
    <van-icon name="question-o" @click="showInfo" />
  </navbar>

  <van-cell-group inset title="攻略">
    <van-cell
      title="签到活动汇总"
      is-link
      url="https://weibo.com/2304898581/Lp8uxiSt3"
    />
  </van-cell-group>

  <van-cell-group inset title="月卡">
    <template v-for="(v, i) in card" :key="i">
      <van-cell
        :title="`「${v.name}」已开通`"
        :label="`${v.count}/d・${v.aka}・${v.desc}`"
        center
      >
        <template #right-icon>
          <van-switch v-model="v.on" size="24" />
        </template>
      </van-cell>
      <van-cell
        v-if="v.on"
        :title="`「${v.name}」过期时间`"
        :value="v.decString"
        clickable
        @click="showCalendar(i)"
      />
    </template>
  </van-cell-group>

  <van-cell-group v-for="(v, i) in data" :key="i" inset :title="v.name + '常'">
    <van-cell
      v-for="(u, j) in v.value"
      :key="j"
      :title="u.name"
      :label="`${u.count}${u.desc ? `・${u.desc}` : ''}`"
      center
    >
      <template #right-icon>
        <van-switch v-model="u.on" size="24" />
      </template>
    </van-cell>
    <van-field
      v-model="v.other"
      type="number"
      label="其他"
      :placeholder="`其他每${v.name}固定得到的小熊星座数`"
      autocomplete="off"
    />
  </van-cell-group>

  <van-cell-group inset title="当前状态">
    <van-field
      v-model="currentCoin"
      type="number"
      label="小熊星座"
      autocomplete="off"
    />
    <van-field
      v-model="currentGachapon"
      type="number"
      label="羽毛笔"
      autocomplete="off"
    />
    <van-field
      v-model="currentGachapon10"
      type="number"
      label="十连签收券"
      autocomplete="off"
    />
    <van-cell
      title="目标日期"
      :value="targetDateString"
      clickable
      @click="showCalendar(-1)"
    />
  </van-cell-group>

  <van-cell-group inset title="计算结果">
    <van-cell title="预计可攒到抽数" :value="gacha" />
    <van-cell title="折合为小熊星座" :value="coin" />
  </van-cell-group>

  <van-calendar
    v-model:show="calendarShow"
    :formatter="calendarFormatter"
    :min-date="startDate"
    @confirm="calendarConfirm"
  />
</template>

<script>
import Navbar from '@/components/Navbar.vue'
let dayjs = require('dayjs')

export default {
  name: 'Hoard',
  components: {
    Navbar,
  },
  data() {
    let data = require('@/assets/data/hoard.json')
    for (let i in data) data[i].other = undefined

    let card = require('@/assets/data/vip.json')
    for (let i in card) card[i].dec = undefined

    return {
      card,
      data,
      currentCoin: undefined,
      currentGachapon: undefined,
      currentGachapon10: undefined,
      currentCalendar: 0,
      calendarShow: false,
      startDate: dayjs().toDate(),
      targetDate: dayjs().add(1, 'month').toDate(),
      targetDateString:
        dayjs().add(1, 'month').format('M 月 D 日') + ' (一个月后)',
    }
  },
  computed: {
    coin() {
      let date = dayjs(this.targetDate)
      let result = this.currentCoin ? Number(this.currentCoin) : 0
      result += (this.currentGachapon ? Number(this.currentGachapon) : 0) * 300
      result +=
        (this.currentGachapon10 ? Number(this.currentGachapon10) : 0) * 3000

      for (let i in this.card) {
        if (this.card[i].on) {
          let times = this.getDiff(date)
          if (this.card[i].dec)
            times = Math.min(times, this.getDiff(this.card[i].dec))
          result += times * this.card[i].count
        }
      }

      for (let i in this.data) {
        let times = this.getDiff(date, this.data[i].unit)
        let pertime = this.data[i].other ? Number(this.data[i].other) : 0
        for (let j in this.data[i].value) {
          if (this.data[i].value[j].on) pertime += this.data[i].value[j].count
        }
        result += times * pertime
      }

      return result
    },
    gacha() {
      return Math.floor(this.coin / 300)
    },
  },
  methods: {
    getDiff(date, unit) {
      return Math.ceil(dayjs(date).diff(dayjs(), unit ? unit : 'day', true))
    },
    showInfo() {
      this.$dialog.alert({
        ...this.$root.dialogSettings,
        message:
          '此工具在计算过程中，所有项目均按照「奖励在第一天发放」的规则参与计算，与实际情况存在偏差。\n\n目标日期越远，计算结果会越准确，但同时活动等不确定因素也增多。\n\n出于上述原因，本工具仅供粗略计算之用。',
      })
    },
    showCalendar(i) {
      this.currentCalendar = i
      this.calendarShow = true
    },
    calendarFormatter(day) {
      if (day.type == 'selected')
        day.bottomInfo = '余 ' + this.getDiff(day.date) + ' 天'
      return day
    },
    calendarConfirm(v) {
      let i = this.currentCalendar
      this.calendarShow = false
      let diff = this.getDiff(v)
      let str = dayjs(v).format('M 月 D 日') + ` (余 ${diff} 天)`
      if (i == -1) {
        this.targetDate = v
        this.targetDateString = str
      } else {
        this.card[i].dec = v
        this.card[i].decString = str
      }
    },
  },
}
</script>
