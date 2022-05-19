<template>
  <van-nav-bar title="羁梦星愿" left-text="返回" left-arrow @click-left="returnHomepage" />

  <van-cell-group inset title="攻略">
    <van-cell title="说明" label="这是一个帮助你计算「羁梦星愿」活动中，如何购买「星愿瓶」最划算的小工具。" />
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

  <van-checkbox-group v-model="paidBottleBought">
    <van-cell-group inset title="当前状态">
      <van-cell title="说明" label="填写下列信息前，请尽可能在「星雾谜戏」用尽所有的「星光手杖」完成星盘，并在「星星驿站」用尽所有的「星芒币」购买限时「星愿瓶」。下面的表单中，括号表示本项的默认值。" />
      <van-field v-model="nextMinigameTime" type="number" label="星雾谜戏" placeholder="详见说明 (1)" center autocomplete="off">
        <template #button>
          <van-button size="small" plain type="primary" @click="nextMinigameTimeDetail = true">查看说明</van-button>
        </template>
      </van-field>
      <van-field v-model="freeBottle" type="number" label="持有限时瓶" placeholder="持有限时星愿瓶的数目 (0)" autocomplete="off" />
      <van-field v-model="paidBottle" type="number" label="持有永久瓶" placeholder="持有永久星愿瓶的数目 (0)" autocomplete="off" />
      <van-field v-model="shopFreeBottleRemain" type="number" label="商店瓶库存" placeholder="星星驿站中星愿瓶剩余数 (20)" autocomplete="off" />
      <van-field v-model="wishedTime" type="number" label="已许愿次数" placeholder="已经许愿的次数 (0)" autocomplete="off" />
      <van-cell title="活动开始日期" :value="calendarString" clickable @click="calendarShow = true" />
      <van-cell title="今日 2 北极星「每日星愿瓶」已购买" clickable @click="paidBottleBoughtToggle(0)">
        <template #right-icon>
          <van-checkbox name="daily" @click.stop :ref="el => paidBottleBoughtRef[0] = el" />
        </template>
      </van-cell>
      <van-cell title="本次 9 北极星「星愿瓶礼盒」已购买" clickable @click="paidBottleBoughtToggle(1)">
        <template #right-icon>
          <van-checkbox name="total" @click.stop :ref="el => paidBottleBoughtRef[1] = el" />
        </template>
      </van-cell>
      <van-field v-model="lostBottle" type="number" label="错过瓶子数" placeholder="错过的限时星愿瓶数目 (0)" autocomplete="off" />
    </van-cell-group>
  </van-checkbox-group>

  <van-cell-group inset title=" ">
    <van-cell title="计算" is-link @click="calculate" />
  </van-cell-group>

  <van-calendar v-model:show="calendarShow" :min-date="minDate" :max-date="maxDate" @confirm="calendarConfirm" :show-confirm="false" />
  <van-config-provider :theme-vars="resultTheme">
    <van-dialog v-model:show="nextMinigameTimeDetail" theme="round-button" closeOnClickOverlay
      confirm-button-color="linear-gradient(135deg, #6c71c5, #93a9da)">
      <div class="container">
        <p class="content">打开「星雾谜戏」活动界面，确认当前的「星光手杖」不足以开启下一局游戏后，将下图中白框位置的数字填写在此处。</p>
        <p class="content">请根据实际情况填写，<strong>而非</strong><span class="delete"> 直接填写 21 </span>。</p>
        <van-image class="content center" width="80%" :src="require('@/assets/img/wish_01.jpg')" />
      </div>
    </van-dialog>
    <van-dialog v-model:show="resultShow" theme="round-button" closeOnClickOverlay
      confirm-button-color="linear-gradient(135deg, #6c71c5, #93a9da)">
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
let dayjs = require('dayjs')

export default {
  name: 'Wish',
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
      nextMinigameTime: undefined,
      nextMinigameTimeDetail: false,
      freeBottle: undefined,
      paidBottle: undefined,
      shopFreeBottleRemain: undefined,
      wishedTime: undefined,
      minDate: dayjs().subtract(5, 'hour').subtract(8, 'day').toDate(),
      maxDate: dayjs().subtract(5, 'hour').add(8, 'day').toDate(),
      calendarShow: false,
      calendarValue: new Date(),
      calendarString: dayjs().format('M 月 D 日'),
      paidBottleBought: [],
      paidBottleBoughtRef: [],
      lostBottle: undefined,
      result: [],
      resultShow: false,
      resultTheme: {
        dialogFontSize: 'var(--van-font-size-md)'
      },
    }
  },
  methods: {
    returnHomepage () {
      this.$router.push('/')
    },
    targetWishTimeSelect (v) {
      this.targetWishTime = v
      this.targetWishTimeSelected = String(v)
    },
    calendarConfirm (v) {
      this.calendarShow = false
      this.calendarValue = v
      this.calendarString = dayjs(v).format('M 月 D 日')
    },
    paidBottleBoughtToggle (i) {
      this.paidBottleBoughtRef[i].toggle()
    },
    calculate () {
      let result = [['免费获取']]
      let getValue = (v, def) => Number(v !== undefined ? v : def)

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
        let hasDiscountBottleBoughtToday = this.paidBottleBought.indexOf('daily') != -1
        let hasBottlePackBought = this.paidBottleBought.indexOf('total') != -1
        let shopDiscountBottleRemain = 8 - dayjs().subtract(5, 'hour').diff(dayjs(this.calendarValue), 'day') - Number(hasDiscountBottleBoughtToday)
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
