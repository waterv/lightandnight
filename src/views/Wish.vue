<template>
  <navbar :title="$t('route.wish')" can-return />

  <van-cell-group :title="$t('common.tutorial')" inset>
    <tutorial-cell message="wish" />
  </van-cell-group>

  <van-radio-group v-model="target">
    <van-cell-group :title="$t('wish.target')" inset>
      <van-cell
        v-for="v in presetTargets"
        :key="v"
        :title="$t('wish.preset', [v.count])"
        :label="$t('wish.presetDesc', [v.desc])"
        clickable
        @click="target = v.count"
      >
        <template #right-icon>
          <van-radio :name="v.count" />
        </template>
      </van-cell>
      <van-cell :title="$t('common.customize')" center>
        <template #right-icon>
          <van-stepper v-model="target" v-bind="stepper" min="64" max="99" />
        </template>
      </van-cell>
    </van-cell-group>
  </van-radio-group>

  <van-cell-group :title="$t('common.currentStatus')" inset>
    <van-cell title="" :label="$t('wish.hint')" />
    <van-cell center>
      <template #title>
        <div @click="showNextMinigameDetail = true">
          {{ $t('wish.nextMinigame') }}
          <van-icon name="question-o" />
        </div>
      </template>
      <template #right-icon>
        <van-stepper v-model="nextMinigame" v-bind="stepper" min="1" />
      </template>
    </van-cell>
    <van-cell :title="$t('wish.freeHad')" center>
      <template #right-icon>
        <van-stepper v-model="freeHad" v-bind="stepper" min="0" />
      </template>
    </van-cell>
    <van-cell :title="$t('wish.paidHad')" center>
      <template #right-icon>
        <van-stepper v-model="paidHad" v-bind="stepper" min="0" />
      </template>
    </van-cell>
    <van-cell :title="$t('wish.shop')" center>
      <template #right-icon>
        <van-stepper v-model="shop" v-bind="stepper" min="0" max="20" />
      </template>
    </van-cell>
    <van-cell :title="$t('wish.wished')" center>
      <template #right-icon>
        <van-stepper v-model="wished" v-bind="stepper" min="0" max="99" />
      </template>
    </van-cell>
    <van-cell
      :title="$t('wish.calendar')"
      :value="calendarString"
      clickable
      @click="showCalendar = true"
    />
    <van-cell :title="$t('wish.dailyBought')">
      <template #right-icon>
        <van-switch v-model="dailyBought" />
      </template>
    </van-cell>
    <van-cell :title="$t('wish.packBought')">
      <template #right-icon>
        <van-switch v-model="packBought" />
      </template>
    </van-cell>
    <van-cell :title="$t('wish.lost')" center>
      <template #right-icon>
        <van-stepper v-model="lost" v-bind="stepper" min="0" />
      </template>
    </van-cell>
  </van-cell-group>

  <van-cell-group title=" " inset>
    <van-cell :title="$t('common.calculate')" is-link @click="calculate" />
  </van-cell-group>

  <van-calendar
    v-model:show="showCalendar"
    :min-date="minDate"
    :max-date="maxDate"
    @confirm="calendarConfirm"
    :show-confirm="false"
  />
  <van-config-provider :theme-vars="theme">
    <van-dialog v-model:show="showNextMinigameDetail" closeOnClickOverlay>
      <div class="container">
        <p class="content" v-t="'wish.nextMinigameDesc'" />
        <van-image class="content" :src="require('@/assets/wish.jpg')" />
      </div>
    </van-dialog>
    <van-dialog v-model:show="showResult" closeOnClickOverlay>
      <div class="container">
        <van-row class="content">
          <van-col v-for="(span, i) in [16, 4, 4]" :key="span" :span="span">
            {{ $t(`wish.result.title[${i}]`) }}
          </van-col>
        </van-row>
        <template v-for="(v, i) in result" :key="v">
          <van-divider v-if="result[i].length == 1" dashed>
            {{ result[i][0] }}
          </van-divider>
          <van-row v-else class="content">
            <van-col v-for="(span, i) in [16, 4, 4]" :key="span" :span="span">
              {{ v[i] }}
            </van-col>
          </van-row>
        </template>
      </div>
    </van-dialog>
  </van-config-provider>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import TutorialCell from '@/components/TutorialCell.vue'
let dayjs = require('dayjs')

export default {
  name: 'WishCalculator',
  components: {
    Navbar,
    TutorialCell,
  },
  data() {
    return {
      presetTargets: [64, 68, 72, 76, 80, 88, 95, 99].map(count => ({
        count,
        desc: this.$t(`wish.presets.${count}`),
      })),
      target: 64,
      targetString: '64',
      nextMinigame: 1,
      showNextMinigameDetail: false,
      freeHad: 0,
      paidHad: 0,
      shop: 20,
      wished: 0,
      lost: 0,
      dailyBought: false,
      packBought: false,
      minDate: dayjs().subtract(5, 'hour').subtract(8, 'day').toDate(),
      maxDate: dayjs().subtract(5, 'hour').toDate(),
      showCalendar: false,
      calendar: new Date(),
      calendarString: dayjs().format(this.$t('wish.dateFormat')),
      result: [],
      showResult: false,
      theme: {
        dialogFontSize: 'var(--van-font-size-md)',
      },
      stepper: {
        integer: true,
        'input-width': '48px',
      },
    }
  },
  methods: {
    calendarConfirm(v) {
      this.showCalendar = false
      this.calendar = v
      this.calendarString = dayjs(v).format(this.$t('wish.dateFormat'))
    },
    calculate() {
      let result = [[this.$t('wish.result.type[0]')]]
      let addResultItem = (key, count, star) => {
        result.push([this.$t(`wish.result.${key}`), count, star])
      }

      let minigame = 23 - (this.nextMinigame || 1)
      addResultItem('minigame', minigame)

      let shop = this.shop || 20
      addResultItem('shop', shop)

      let wished = this.wished || 0
      let progress = 5
      ;[6, 18, 32, 46, 52].forEach(bonusTime => {
        if (wished >= bonusTime) progress -= 1
      })
      addResultItem('progress', progress)

      let freeHad = this.freeHad || 0
      let paidHad = this.paidHad || 0
      if (freeHad + paidHad) addResultItem('current', freeHad + paidHad)

      let lost = this.lost || 0
      if (lost) addResultItem('lost', -lost)

      result.push([this.$t('wish.result.type[1]')])
      let have = minigame + shop + wished + freeHad + paidHad - lost + progress
      let need = this.target - have

      if (need > 0) {
        let { dailyBought, packBought } = this
        let dailyRemain =
          8 -
          dayjs().subtract(5, 'hour').diff(dayjs.tz(this.calendar), 'day') -
          Number(dailyBought)
        let star = 0

        if ((need < 4 && dailyRemain >= 0) || (need == 4 && dailyRemain >= 4)) {
          let daily = Math.min(need, dailyRemain)
          need -= daily
          star += daily * 2
          addResultItem('daily', daily, daily * 2)
        } else {
          if (!packBought) {
            need -= 6
            star += 9
            addResultItem('pack', 6, 9)
          }
          if (need > 0 && dailyRemain) {
            let daily = Math.min(need, dailyRemain)
            need -= daily
            star += daily * 2
            addResultItem('daily', daily, daily * 2)
          }
          if (need > 0) {
            star += need * 3
            addResultItem('direct', need, need * 3)
          }
        }
        result.push([this.$t('wish.result.type[2]')])
        addResultItem('total', this.target - wished - need, star)
        // 购买 9 北极星礼盒可能导致星愿瓶溢出 (need < 0)
        // 因此此处减去 need 以得到实际可得抽数
      } else {
        result.push([this.$t('wish.result.type[2]')])
        addResultItem('total', have - wished, 0)
      }

      this.result = result
      this.showResult = true
    },
  },
}
</script>
