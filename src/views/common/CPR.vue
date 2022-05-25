<template>
  <navbar title="礼包性价比" can-return>
    <van-icon name="question-o" @click="showInfo" />
  </navbar>

  <van-cell-group title="攻略" inset>
    <van-cell
      title="常驻礼包性价比"
      is-link
      center
      url="https://weibo.com/2304898581/Lg2v1rjG8"
    />
    <van-cell
      title="其他攻略"
      is-link
      center
      url="https://weibo.com/u/2304898581"
    />
  </van-cell-group>

  <van-radio-group v-model="gemRatioSelected">
    <van-cell-group title="北极星兑换比率" inset>
      <van-cell title="说明" is-link @click="showGemRatioInfo" />

      <van-cell
        v-for="v in gemRatioData"
        :key="v"
        :title="`1 北极星 = ${v.value} 小熊星座`"
        :label="v.desc"
        clickable
        @click="gemRatioSelect(v.value)"
      >
        <template #right-icon>
          <van-radio :name="`${v.value}`" />
        </template>
      </van-cell>

      <van-cell title="自定义" center>
        <template #right-icon>
          <van-stepper
            v-model="gemRatio"
            min="50"
            input-width="48px"
            @change="gemRatioSelect(gemRatio)"
          />
        </template>
      </van-cell>
    </van-cell-group>
  </van-radio-group>

  <van-cell-group title="礼包内容" inset>
    <van-field
      v-model="price"
      label="售价"
      placeholder="单位：RMB"
      type="number"
      autocomplete="off"
    />
    <van-field v-model="gem" label="北极星" type="number" autocomplete="off" />
    <van-field
      v-model="coin"
      label="小熊星座"
      type="number"
      autocomplete="off"
    />
    <van-field
      v-model="gachapon"
      label="羽毛笔"
      type="number"
      autocomplete="off"
    />
    <van-field
      v-model="gachapon10"
      label="十连签收券"
      type="number"
      autocomplete="off"
    />
  </van-cell-group>

  <van-cell-group title=" " inset>
    <van-cell title="计算" is-link @click="calculate" />
  </van-cell-group>

  <van-cell-group title="计算结果" inset>
    <van-cell title="包含抽数" :value="gachaCount" />
    <van-cell title="性价比" :value="ratio" />
    <van-cell title="每抽价格" :value="pricePerGacha" />
    <van-cell title="清空" is-link @click="clear" />
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
  data() {
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
    showInfo() {
      this.$dialog.alert({
        ...this.$root.dialogSettings,
        message:
          '此工具仅计算礼包用于抽卡的性价比，游戏中显示的性价比计入了「极光币」等培养材料。\n\n不氪立省百分百。',
      })
    },
    showGemRatioInfo() {
      this.$dialog.alert({
        ...this.$root.dialogSettings,
        message:
          '本游戏中，抽卡道具的原价为：\n\n1 羽毛笔 = 300 小熊星座 = 6 北极星 = 18 元\n\n北极星与其他道具的兑换比率不固定，因此计算性价比时需要分不同情况讨论。\n\n请根据您一般使用北极星兑换小熊星座的途径，选择恰当的兑换比率。\n\n如果还是不明白选什么：重氪选 [50]，其他选 [100]。',
      })
    },
    gemRatioSelect(v) {
      this.gemRatio = v
      this.gemRatioSelected = String(v)
    },
    calculate() {
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

      let gachaCount =
        (gem * this.gemRatio + coin) / 300 + gachapon + 10 * gachapon10
      if (!gachaCount) {
        Notify('请输入礼包内容。')
        return
      }

      let result = (gachaCount / price) * 18
      this.gachaCount = String(Math.round(gachaCount * 100) / 100) + ' 抽'
      this.ratio = String(Math.round(result * 100)) + '%'
      this.pricePerGacha = String(Math.round((18 / result) * 100) / 100) + ' 元'
    },
    clear() {
      this.price = undefined
      this.gem = undefined
      this.coin = undefined
      this.gachapon = undefined
      this.gachapon10 = undefined
      this.gachaCount = ''
      this.ratio = ''
      this.pricePerGacha = ''
    },
  },
}
</script>
