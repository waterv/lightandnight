<template>
  <navbar title="礼包性价比计算器" can-return>
    <van-icon name="question-o" @click="showInfo" />
  </navbar>
  <van-tabs v-model:active="active" sticky offset-top="46">
    <van-tab title="计算">
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

      <van-cell-group title="礼包详情" inset>
        <van-field v-model="name" label="名称" autocomplete="off" />
        <van-field
          v-model="price"
          label="售价"
          placeholder="单位：RMB"
          type="number"
          autocomplete="off"
        />
        <van-field
          v-model="gem"
          label="北极星"
          type="number"
          autocomplete="off"
        />
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
        <van-cell title="计算" is-link @click="calculate" />
      </van-cell-group>

      <van-cell-group title="计算结果" inset>
        <van-cell title="包含抽数" :value="gachaCount" />
        <van-cell title="性价比" :value="ratio" />
        <van-cell title="每抽价格" :value="pricePerGacha" />
      </van-cell-group>
      <van-cell-group title=" " inset>
        <van-cell title="加入列表" is-link @click="add" />
        <van-cell title="清除当前输入" is-link @click="clear" />
      </van-cell-group>
    </van-tab>
    <van-tab title="列表">
      <van-cell-group v-if="showTutorial" title="说明" inset>
        <van-swipe-cell>
          <van-cell
            title="礼包名称"
            value="性价比"
            label="点击以选择，左滑以删除"
            center
          />
          <template #right>
            <van-button
              text="删除"
              @click="closeTutorial"
              class="swipe-button"
              square
              type="danger"
            />
          </template>
        </van-swipe-cell>
      </van-cell-group>
      <van-cell-group title=" " inset>
        <van-swipe-cell v-for="(v, i) in packages" :key="v">
          <van-cell
            :value="result(v).ratio + '%'"
            :label="`¥${v.price} = ${result(v).gachaCount} 抽 (${
              result(v).pricePerGacha
            } 元/抽)`"
            @click="selectPackage(i)"
            center
            clickable
          >
            <template #title>
              {{ v.name }}
              <van-tag v-if="v.selected" type="primary">已选</van-tag>
            </template>
          </van-cell>

          <template #right>
            <van-button
              text="删除"
              @click="removePackage(i)"
              class="swipe-button"
              square
              type="danger"
            />
          </template>
        </van-swipe-cell>
      </van-cell-group>
      <van-cell-group title=" " inset>
        <van-cell
          title="已选中礼包总体"
          :value="`${total.price ? `${total.ratio}%` : '-'}`"
          :label="`${
            total.price
              ? `¥${total.price} = ${total.gachaCount} 抽 (${total.pricePerGacha} 元/抽)`
              : '未选中'
          }`"
          center
        />
      </van-cell-group>
    </van-tab>
  </van-tabs>
</template>

<script>
import { Notify, Card, SwipeCell, Toast, Tag } from 'vant'
import Navbar from '@/components/Navbar.vue'
let packages = require('@/assets/data/packages.json')

export default {
  name: 'CPR',
  components: {
    [Notify.name]: Notify,
    [Card.name]: Card,
    [SwipeCell.name]: SwipeCell,
    [Toast.name]: Toast,
    [Tag.name]: Tag,
    Navbar,
  },
  data() {
    return {
      active: 0,
      gemRatio: 100,
      gemRatioData: [
        { value: 150, desc: '活动十连特惠（20 北极星十连，部分活动出现）' },
        { value: 100, desc: '本月十连特惠、今日星座专享' },
        { value: 71.33, desc: '福袋（平均值，部分活动出现）' },
        { value: 50, desc: '原价兑换' },
      ],
      gemRatioSelected: '100',
      name: '',
      price: undefined,
      gem: undefined,
      coin: undefined,
      gachapon: undefined,
      gachapon10: undefined,
      gachaCount: '',
      ratio: '',
      pricePerGacha: '',
      showTutorial: localStorage?.getItem('showTutorial') !== 'false',
      packages: packages.map(v => {
        return { ...v }
      }),
    }
  },
  computed: {
    total() {
      let v = this.packages.reduce(
        (acc, v) => {
          if (v.selected)
            return {
              price: acc.price + v.price,
              gem: acc.gem + v.gem,
              coin: acc.coin + v.coin,
              gachapon: acc.gachapon + v.gachapon,
              gachapon10: acc.gachapon10 + v.gachapon10,
            }
          return acc
        },
        {
          price: 0,
          gem: 0,
          coin: 0,
          gachapon: 0,
          gachapon10: 0,
        }
      )
      v = {
        ...v,
        ...this.result(v),
      }
      return v
    },
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
      this.packages.sort((a, b) => {
        return this.result(b).ratio - this.result(a).ratio
      })
    },
    result(v) {
      let gachaCount =
        (v.gem * this.gemRatio + v.coin) / 300 + v.gachapon + 10 * v.gachapon10
      let result = (gachaCount / v.price) * 18
      return {
        gachaCount: Math.round(gachaCount * 100) / 100,
        ratio: Math.round(result * 100),
        pricePerGacha: Math.round((18 / result) * 100) / 100,
      }
    },
    calculate() {
      if (!this.price) {
        Toast({ message: '请输入礼包售价。', icon: 'close' })
        return
      }
      let v = {
        price: Number(this.price),
        gem: Number(this.gem || 0),
        coin: Number(this.coin || 0),
        gachapon: Number(this.gachapon || 0),
        gachapon10: Number(this.gachapon10 || 0),
      }
      let result = this.result(v)
      if (!result.gachaCount) {
        Toast({ message: '请输入礼包内容。', icon: 'close' })
        return
      }

      this.gachaCount = result.gachaCount + ' 抽'
      this.ratio = result.ratio + '%'
      this.pricePerGacha = result.pricePerGacha + ' 元'
    },
    add() {
      if (!this.price) {
        Toast({ message: '请输入礼包售价。', icon: 'close' })
        return
      }
      this.calculate()
      if (!this.gachaCount) {
        Toast({ message: '请输入礼包内容。', icon: 'close' })
        return
      }
      if (!this.name) {
        Toast({ message: '请输入礼包名称。', icon: 'close' })
        return
      }
      this.packages.push({
        name: this.name,
        price: Number(this.price),
        gem: Number(this.gem || 0),
        coin: Number(this.coin || 0),
        gachapon: Number(this.gachapon || 0),
        gachapon10: Number(this.gachapon10 || 0),
      })
      this.packages.sort((a, b) => {
        return this.result(b).ratio - this.result(a).ratio
      })
      this.clear()
      Toast({ message: '已加入列表。', icon: 'passed' })
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
    closeTutorial() {
      this.showTutorial = false
      localStorage.setItem('showTutorial', 'false')
    },
    removePackage(i) {
      this.packages.splice(i, 1)
    },
    selectPackage(i) {
      this.packages[i].selected = !this.packages[i].selected
    },
  },
}
</script>

<style scoped>
.swipe-button {
  height: 100%;
}
</style>
