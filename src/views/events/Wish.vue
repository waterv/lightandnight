<template>
  <navbar title="羁梦星愿" can-return />

  <van-cell-group inset title="攻略">
    <van-cell title="「星雾谜戏」攻略、星盘对照图" url="https://weibo.com/2304898581/Lha6s1oIu" is-link center />
    <van-cell title="「羁梦星愿」攻略" label="在活动开启第一天得到 18 个限时星愿瓶的攻略，见此链接中图 4 的 1～6 步。" url="https://weibo.com/2304898581/LgDLGeIYw" is-link center />
    <van-cell title="「羁梦星愿」礼包性价比" url="https://weibo.com/2304898581/Lh7DbiDhz" is-link center />
  </van-cell-group>

  <van-radio-group v-model="targetWishTimeSelected">
    <van-cell-group inset title="目标抽数">
      <van-cell v-for="v in targetWishTimeData" :key="v"
        :title="v.count + ' 抽'" :label="'保底：' + v.desc" clickable @click="targetWishTimeSelect(v.count)">
        <template #right-icon><van-radio :name="String(v.count)" /></template>
      </van-cell>
      <van-cell title="自定义" center>
        <template #right-icon>
          <van-stepper v-model="targetWishTime" integer min="64" max="99" @change="targetWishTimeSelect(targetWishTime)" />
        </template>
      </van-cell>
   </van-cell-group>
  </van-radio-group>

  <van-cell-group inset title="当前状态">
    <van-cell center>
      <template #title><div @click="nextMinigameTimeDetail = true">星雾谜戏 <van-icon name="question-o" /></div></template>
      <template #right-icon><van-stepper v-model="nextMinigameTime" integer min="1" /></template>
    </van-cell>
    <van-cell title="持有限时星愿瓶" center>
      <template #right-icon><van-stepper v-model="freeBottle" integer min="0" /></template>
    </van-cell>
    <van-cell title="持有永久星愿瓶" center>
      <template #right-icon><van-stepper v-model="paidBottle" integer min="0" /></template>
    </van-cell>
    <van-cell title="「星星驿站」星愿瓶剩余库存" center>
      <template #right-icon><van-stepper v-model="shopFreeBottleRemain" integer min="0" max="20" /></template>
    </van-cell>
    <van-cell title="已许愿次数" center>
      <template #right-icon><van-stepper v-model="wishedTime" integer min="0" max="99" /></template>
    </van-cell>
    <van-cell title="活动开始日期" :value="calendarString" clickable @click="calendarShow = true" />
    <van-cell title="已购买今日 2 北极星「每日星愿瓶」">
      <template #right-icon><van-switch v-model="hasDiscountBottleBoughtToday" size="24" /></template>
    </van-cell>
    <van-cell title="已购买本次 9 北极星「星愿瓶礼盒」">
      <template #right-icon><van-switch v-model="hasBottlePackBought" size="24" /></template>
    </van-cell>
    <van-cell title="错过限时星愿瓶" center>
      <template #right-icon><van-stepper v-model="lostBottle" integer min="0" /></template>
    </van-cell>
  </van-cell-group>

  <van-cell-group inset title=" ">
    <van-cell title="计算" is-link @click="calculate" />
  </van-cell-group>

  <van-calendar v-model:show="calendarShow" :min-date="minDate" :max-date="maxDate" @confirm="calendarConfirm" :show-confirm="false" />
  <van-config-provider :theme-vars="resultTheme">
    <van-dialog v-model:show="nextMinigameTimeDetail" theme="round-button" closeOnClickOverlay :confirm-button-color="buttonColor">
      <div class="container">
        <p class="content">打开「星雾谜戏」活动界面，将下图中白框位置的数字填写在此处。</p>
        <p class="content">请根据实际情况填写，<strong>而非</strong><span class="delete"> 直接填写 21 </span>。</p>
        <van-image class="content center" width="80%" :src="require('@/assets/img/wish_01.jpg')" />
      </div>
    </van-dialog>
    <van-dialog v-model:show="resultShow" theme="round-button" closeOnClickOverlay :confirm-button-color="buttonColor">
      <div class="container">
        <van-row class="content">
          <van-col span="16"><strong>项目</strong></van-col>
          <van-col span="4"><strong>抽数</strong></van-col>
          <van-col span="4"><strong>北极星</strong></van-col>
        </van-row>
        <template v-for="(v, i) in result" :key="v">
          <van-divider v-if="result[i].length == 1" dashed>{{result[i][0]}}</van-divider>
          <van-row v-else class="content">
            <van-col v-for="(span, i) in [16, 4, 4]" :key="span" :span="span">{{v[i]}}</van-col>
          </van-row>
        </template>
      </div>
    </van-dialog>
  </van-config-provider>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
let dayjs = require('dayjs')

export default {
  name: 'Wish',
  components: {
    Navbar,
  },
  data () {
    return {
      targetWishTimeData: [
        { count: 64, desc: '限定灵犀' },
        { count: 68, desc: '限定灵犀 + 1 花' },
        { count: 72, desc: '限定灵犀 + 2 花' },
        { count: 76, desc: '限定灵犀 + 3 花' },
        { count: 80, desc: '限定灵犀 + 4 花' },
        { count: 88, desc: '限定灵犀 + 4 花 + 1 个星辰馈赠' },
        { count: 95, desc: '限定灵犀 + 4 花 + 2 个星辰馈赠' },
        { count: 99, desc: '所有转盘和进度奖励（含限定灵犀 + 5 花）' },
      ],
      targetWishTime: 64,
      targetWishTimeSelected: '64',
      nextMinigameTime: 1,
      nextMinigameTimeDetail: false,
      freeBottle: 0,
      paidBottle: 0,
      shopFreeBottleRemain: 20,
      wishedTime: 0,
      lostBottle: 0,
      hasDiscountBottleBoughtToday: false,
      hasBottlePackBought: false,
      minDate: dayjs().subtract(5, 'hour').subtract(8, 'day').toDate(),
      maxDate: dayjs().subtract(5, 'hour').toDate(),
      buttonColor: this.$root.colors.events.wish,
      calendarShow: false,
      calendarValue: new Date(),
      calendarString: dayjs().format('M 月 D 日'),
      result: [],
      resultShow: false,
      resultTheme: {
        dialogFontSize: 'var(--van-font-size-md)'
      },
    }
  },
  methods: {
    targetWishTimeSelect (v) {
      this.targetWishTime = v
      this.targetWishTimeSelected = String(v)
    },
    calendarConfirm (v) {
      this.calendarShow = false
      this.calendarValue = v
      this.calendarString = dayjs(v).format('M 月 D 日')
    },
    calculate () {
      let result = [['免费获取']]
      let getValue = (v, def) => Number(v ? v : def)

      let minigameTime = 23 - getValue(this.nextMinigameTime, 1)
      result.push(['「星雾谜戏」活动', minigameTime])

      let shopFreeBottleRemain = getValue(this.shopFreeBottleRemain, 20)
      result.push(['「星星驿站」兑换', shopFreeBottleRemain])

      let wishedTime = getValue(this.wishedTime, 0)
      let progressBottle = 5
      if (wishedTime >= 6) progressBottle -= 1
      if (wishedTime >= 18) progressBottle -= 1
      if (wishedTime >= 32) progressBottle -= 1
      if (wishedTime >= 46) progressBottle -= 1
      if (wishedTime >= 52) progressBottle -= 1
      result.push(['「羁梦星愿」进度奖励', progressBottle])

      let freeBottle = getValue(this.freeBottle, 0)
      let paidBottle = getValue(this.paidBottle, 0)
      if (freeBottle + paidBottle) result.push(['当前持有', freeBottle + paidBottle])

      let lostBottle = getValue(this.lostBottle, 0)
      if (lostBottle) result.push(['错过的星愿瓶', -lostBottle])

      result.push(['付费获取'])
      let bottleHave = minigameTime + shopFreeBottleRemain + wishedTime + freeBottle + paidBottle - lostBottle + progressBottle
      let bottleNeed = this.targetWishTime - bottleHave

      if (bottleNeed > 0) {
        let hasDiscountBottleBoughtToday = this.hasDiscountBottleBoughtToday
        let hasBottlePackBought = this.hasBottlePackBought
        let shopDiscountBottleRemain = 8 - dayjs().subtract(5, 'hour').diff(dayjs.tz(this.calendarValue), 'day') - Number(hasDiscountBottleBoughtToday)
        let gemsNeed = 0

        if ((bottleNeed < 4 && shopDiscountBottleRemain >= 0) ||
            (bottleNeed == 4 && shopDiscountBottleRemain >= 4)) {
          let discountBottleBuy = Math.min(bottleNeed, shopDiscountBottleRemain)
          bottleNeed -= discountBottleBuy
          gemsNeed += discountBottleBuy * 2
          result.push(['每日星愿瓶', discountBottleBuy, discountBottleBuy * 2])
        } else {
          if (!hasBottlePackBought) {
            bottleNeed -= 6
            gemsNeed += 9
            result.push(['星愿瓶礼盒', 6, 9])
          }
          if (bottleNeed > 0 && shopDiscountBottleRemain) {
            let discountBottleBuy = Math.min(bottleNeed, shopDiscountBottleRemain)
            bottleNeed -= discountBottleBuy
            gemsNeed += discountBottleBuy * 2
            result.push(['每日星愿瓶', discountBottleBuy, discountBottleBuy * 2])
          }
          if (bottleNeed > 0) {
            gemsNeed += bottleNeed * 3
            result.push(['原价购买', bottleNeed, bottleNeed * 3])
          }
        }
        result.push(['小计'])
        result.push(['小计', this.targetWishTime - wishedTime, gemsNeed])
      } else {
        result.push(['小计'])
        result.push(['小计', bottleHave - wishedTime, 0])
      }

      this.result = result
      this.resultShow = true
    }
  }
}
</script>
