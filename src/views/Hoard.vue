<template>
  <navbar :title="$t('route.hoard')" hint="hoard" can-return />

  <van-cell-group :title="$t('common.tutorial')" inset>
    <tutorial-cell message="hoard" />
  </van-cell-group>

  <van-cell-group :title="$t('hoard.card')" inset>
    <template v-for="(v, i) in card" :key="i">
      <van-cell
        :title="v.name"
        :label="$t('hoard.cardDesc', [v.count, v.unit, v.aka, v.desc])"
        center
      >
        <template #right-icon>
          <van-switch v-model="v.on" />
        </template>
      </van-cell>
      <van-field
        v-if="v.level && v.on"
        v-model="v.level[v.curLevel].text"
        :label="$t('hoard.level')"
        left-icon="arrow"
        readonly
        is-link
        @click="showPicker(v)"
      />
      <van-cell
        v-if="v.on"
        :title="$t('hoard.decline')"
        icon="arrow"
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
      :label="$t('hoard.itemDesc', [u.count, u.desc])"
      center
    >
      <template #right-icon>
        <van-switch v-model="u.on" />
      </template>
    </van-cell>
    <van-field
      v-model="v.other"
      type="number"
      :label="$t('hoard.other')"
      :placeholder="$t('hoard.otherDesc', [v.name])"
      autocomplete="off"
    />
  </van-cell-group>

  <van-cell-group inset :title="$t('common.currentStatus')">
    <van-field
      :left-icon="require('@/assets/items/100003.png')"
      :label="$t('items.100003')"
      v-model="currentBear"
      type="number"
      autocomplete="off"
    />
    <van-field
      :left-icon="require('@/assets/items/100011.png')"
      :label="$t('items.100011')"
      v-model="currentGachapon"
      type="number"
      autocomplete="off"
    />
    <van-field
      :left-icon="require('@/assets/items/100012.png')"
      :label="$t('items.100012')"
      v-model="currentGachapon10"
      type="number"
      autocomplete="off"
    />
    <van-cell
      :title="$t('hoard.target')"
      :value="targetDateString"
      clickable
      @click="showCalendar(-1)"
    />
  </van-cell-group>

  <van-cell-group inset :title="$t('common.result')">
    <van-cell :title="$t('hoard.resultGacha')" :value="gacha" />
    <van-cell
      :title="$t('common.equalsTo', [$t('items.100003')])"
      :value="bear"
    />
  </van-cell-group>

  <van-calendar
    v-model:show="calendarShow"
    :formatter="calendarFormatter"
    :min-date="startDate"
    @confirm="calendarConfirm"
    safe-area-inset-bottom
  />

  <van-popup
    v-model:show="pickerShow"
    round
    position="bottom"
    safe-area-inset-bottom
  >
    <van-picker
      :columns="pickerColumn"
      :default-index="0"
      @confirm="pickerConfirm"
      @cancel="pickerShow = false"
    />
  </van-popup>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import TutorialCell from '@/components/TutorialCell.vue'
let dayjs = require('dayjs')

export default {
  name: 'HoardCalculator',
  components: {
    Navbar,
    TutorialCell,
  },
  data() {
    let { data, card } = require(`@/data/${this.$root.server}/hoard.json`)
    for (let i in data) data[i].other = undefined
    for (let i in card) card[i].dec = undefined
    return {
      card,
      data,
      currentBear: undefined,
      currentGachapon: undefined,
      currentGachapon10: undefined,
      currentCalendar: 0,
      pickerColumn: [],
      pickerTarget: {},
      pickerShow: false,
      calendarShow: false,
      startDate: dayjs().toDate(),
      targetDate: dayjs().add(1, 'month').toDate(),
      targetDateString: dayjs()
        .add(1, 'month')
        .format(this.$t('hoard.dateFormat', [this.$t('hoard.defaultRemain')])),
    }
  },
  computed: {
    bear() {
      let date = dayjs(this.targetDate)
      let result = this.currentBear ? Number(this.currentBear) : 0
      result += (this.currentGachapon ? Number(this.currentGachapon) : 0) * 300
      result +=
        (this.currentGachapon10 ? Number(this.currentGachapon10) : 0) * 3000

      for (let i in this.card) {
        if (this.card[i].on) {
          let times = this.getDiff(date, this.card[i].unit)
          if (this.card[i].dec)
            times = Math.min(
              times,
              this.getDiff(this.card[i].dec, this.card[i].unit)
            )
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
      return Math.floor(this.bear / 300)
    },
  },
  methods: {
    getDiff(date, unit) {
      return Math.ceil(dayjs(date).diff(dayjs(), unit ? unit : 'day', true))
    },
    showPicker(v) {
      this.pickerColumn = v.level.map((u, i) => {
        return { ...u, index: i }
      })
      this.pickerTarget = v
      this.pickerShow = true
    },
    pickerConfirm(v) {
      let res = v.selectedOptions[0]
      this.pickerTarget.count = res.value
      this.pickerTarget.curLevel = res.index
      this.pickerShow = false
    },
    showCalendar(i) {
      this.currentCalendar = i
      this.calendarShow = true
    },
    calendarFormatter(day) {
      if (day.type == 'selected')
        day.bottomInfo = this.$t('hoard.remain', [this.getDiff(day.date)])
      return day
    },
    calendarConfirm(v) {
      let i = this.currentCalendar
      this.calendarShow = false
      let diff = this.getDiff(v)
      let str = dayjs(v).format(
        this.$t('hoard.dateFormat', [this.$t('hoard.remain', [diff])])
      )
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
