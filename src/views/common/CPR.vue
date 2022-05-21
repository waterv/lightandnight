<template>
  <navbar title="礼包性价比" can-return />

  <van-cell-group inset title="攻略">
    <van-cell title="说明" label="本工具仅计算抽卡道具性价比，礼包总体性价比通常可在游戏中直接看到。不氪立省百分百。" />
    <van-cell title="常驻礼包性价比" url="https://weibo.com/2304898581/Lg2v1rjG8" is-link center />
    <van-cell title="其他攻略" url="https://weibo.com/u/2304898581" is-link center />
  </van-cell-group>

  <van-radio-group v-model="gemRatioSelected">
    <van-cell-group inset title="北极星兑换比率">
      <van-cell title="说明" label="本游戏中，抽卡相关代币的原价为：1 羽毛笔 = 300 小熊星座 = 6 北极星 = 18 元。因为北极星与抽卡道具的兑换比率不固定，计算礼包性价比时需要分不同情况讨论。因为性价比高的兑换方式限量，氪度越高兑换比率越低。" />
      <van-cell v-for="v in gemRatioData" :key="v"
        :title="`1 北极星 = ${v.value} 小熊星座`" :label="v.desc"
        clickable @click="gemRatioSelect(v.value)">
        <template #right-icon><van-radio :name="`${v.value}`" /></template>
      </van-cell>
      <van-cell title="自定义" center>
        <template #right-icon>
          <van-stepper v-model="gemRatio" min="50" input-width="48px" @change="gemRatioSelect(gemRatio)" />
        </template>
      </van-cell>
    </van-cell-group>
  </van-radio-group>

  <van-cell-group inset title="礼包内容">
    <van-field v-model="price" type="number" label="售价" placeholder="单位：RMB" autocomplete="off" />
    <van-field v-model="gem" type="number" label="北极星" autocomplete="off" />
    <van-field v-model="coin" type="number" label="小熊星座" autocomplete="off" />
    <van-field v-model="gachapon" type="number" label="羽毛笔" autocomplete="off" />
    <van-field v-model="gachapon10" type="number" label="十连签收券" autocomplete="off" />
  </van-cell-group>

  <van-cell-group inset title=" ">
    <van-cell title="计算" is-link @click="calculate" />
  </van-cell-group>

  <van-cell-group inset title="计算结果">
    <van-cell title="包含抽数" :value="gachaCount" />
    <van-cell title="性价比" :value="ratio" />
    <van-cell title="每抽价格" :value="pricePerGacha" />
    <van-cell title="清空" can-click is-link @click="clear" />
  </van-cell-group>
</template>

<script>
import { Notify } from 'vant'
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'CPR',
  components: {
    [Notify.name]: Notify,
    Navbar,
  },
  data () {
    return {
      gemRatio: 100,
      gemRatioData: [
        { value: 150, desc: '活动十连特惠（20 北极星十连，部分活动出现）' },
        { value: 100, desc: '本月十连特惠、今日星座专享' },
        { value: 71.33, desc: '福袋（平均值，部分活动出现）' },
        { value: 50, desc: '原价兑换' },
      ],
      gemRatioSelected: '100',
      price: undefined,
      gem: undefined,
      coin: undefined,
      gachapon: undefined,
      gachapon10: undefined,
      gachaCount: '',
      ratio: '',
      pricePerGacha: '',
    }
  },
  methods: {
    gemRatioSelect (v) {
      this.gemRatio = v
      this.gemRatioSelected = String(v)
    },
    calculate () {
      let getValue = (v, def) => Number(v ? v : def)
      let price = getValue(this.price, 0)
      if (!price) {
        Notify('请输入礼包售价。')
        return
      }
      let gem = getValue(this.gem, 0)
      let coin = getValue(this.coin, 0)
      let gachapon = getValue(this.gachapon, 0)
      let gachapon10 = getValue(this.gachapon10, 0)
        
      let gachaCount = (gem * this.gemRatio + coin) / 300 + gachapon + 10 * gachapon10
      if (!gachaCount) {
        Notify('请输入礼包内容。')
        return
      }

      let result = gachaCount / price * 18
      this.gachaCount = String(Math.round(gachaCount * 100) / 100) + ' 抽'
      this.ratio = String(Math.round(result * 100)) + '%'
      this.pricePerGacha = String(Math.round(18 / result * 100) / 100) + ' 元'
    },
    clear () {
      this.price = undefined
      this.gem = undefined
      this.coin = undefined
      this.gachapon = undefined
      this.gachapon10 = undefined
      this.gachaCount = ''
      this.ratio = ''
      this.pricePerGacha = ''
    },
  }
}
</script>