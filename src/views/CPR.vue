<template>
  <navbar :title="$t('route.cpr')" hint="cpr" can-return />

  <van-tabs v-model:active="active" sticky offset-top="46">
    <van-tab :title="$t('common.calculate')">
      <van-cell-group inset :title="$t('common.tutorial')">
        <tutorial-cell message="cpr" />
      </van-cell-group>

      <van-radio-group v-model="starRatioSelected">
        <van-cell-group :title="$t('cpr.ratio')" inset>
          <van-cell
            :title="$t('common.info')"
            icon="question-o"
            is-link
            @click="showStarRatioInfo"
          />

          <van-cell
            v-for="v in starRatioData"
            :key="v"
            :title="$t('cpr.ratioNumber', [v.value])"
            :label="v.desc"
            clickable
            @click="starRatioSelect(v.value)"
          >
            <template #right-icon>
              <van-radio :name="`${v.value}`" />
            </template>
          </van-cell>

          <van-cell :title="$t('common.customize')" center>
            <template #right-icon>
              <van-stepper
                v-model="starRatio"
                min="50"
                input-width="48px"
                @change="starRatioSelect(starRatio)"
              />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>

      <van-cell-group :title="$t('cpr.detail')" inset>
        <van-field
          v-model="name"
          :label="$t('common.name')"
          :placeholder="$t('cpr.nameDesc')"
          autocomplete="off"
        />
        <van-field
          v-model="price"
          :label="$t('cpr.price')"
          type="number"
          autocomplete="off"
        >
          <template #right-icon>
            {{ $t('cpr.priceUnit') }}
          </template>
        </van-field>
        <van-field
          v-model="star"
          :left-icon="require('@/assets/img/items/star.png')"
          :label="$t('items.star')"
          type="number"
          autocomplete="off"
        />
        <van-field
          v-model="bear"
          :left-icon="require('@/assets/img/items/100003.png')"
          :label="$t('items.100003')"
          type="number"
          autocomplete="off"
        />
        <van-field
          v-model="gachapon"
          :left-icon="require('@/assets/img/items/100011.png')"
          :label="$t('items.100011')"
          type="number"
          autocomplete="off"
        />
        <van-field
          v-model="gachapon10"
          :left-icon="require('@/assets/img/items/100012.png')"
          :label="$t('items.100012')"
          type="number"
          autocomplete="off"
        />
        <van-cell :title="$t('common.calculate')" is-link @click="calculate" />
      </van-cell-group>

      <van-cell-group :title="$t('common.result')" inset>
        <van-cell :title="$t('cpr.gachaCount')" :value="gachaCount" />
        <van-cell :title="$t('cpr.cpr')" :value="ratio" />
        <van-cell :title="$t('cpr.pricePerGacha')" :value="pricePerGacha" />
      </van-cell-group>
      <van-cell-group title="" inset>
        <van-cell :title="$t('cpr.add')" is-link @click="add" />
        <van-cell :title="$t('cpr.clear')" is-link @click="clear" />
      </van-cell-group>
    </van-tab>

    <van-tab :title="$t('cpr.list')">
      <van-cell-group v-if="showTutorial" :title="$t('common.info')" inset>
        <van-swipe-cell>
          <van-cell
            :title="$t('cpr.tutorial.name')"
            :value="$t('cpr.tutorial.cpr')"
            :label="$t('cpr.tutorial.hint')"
            center
          />
          <template #right>
            <van-button
              :text="$t('common.delete')"
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
            :value="$t('cpr.cprNumber', [result(v).ratio])"
            :label="
              $t('cpr.result', [
                v.price,
                result(v).gachaCount,
                result(v).pricePerGacha,
              ])
            "
            @click="selectPackage(i)"
            center
            clickable
          >
            <template #title>
              {{ v.name }}
              <van-tag v-if="v.selected" type="primary">
                {{ $t('common.selected') }}
              </van-tag>
            </template>
          </van-cell>

          <template #right>
            <van-button
              :text="$t('common.delete')"
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
          :title="$t('cpr.selected')"
          :value="total.price ? $t('cpr.cprNumber', [total.ratio]) : '-'"
          :label="
            total.price
              ? $t('cpr.result', [
                  total.price,
                  total.gachaCount,
                  total.pricePerGacha,
                ])
              : $t('cpr.noSelect')
          "
          center
        />
      </van-cell-group>
    </van-tab>
  </van-tabs>
</template>

<script>
import { showDialog, showToast, Card, SwipeCell, Tag } from 'vant'
import Navbar from '@/components/Navbar.vue'
import TutorialCell from '@/components/TutorialCell.vue'

export default {
  name: 'CprCalculator',
  components: {
    [Card.name]: Card,
    [SwipeCell.name]: SwipeCell,
    [Tag.name]: Tag,
    Navbar,
    TutorialCell,
  },
  data() {
    return {
      active: 0,
      starRatio: 100,
      starRatioData: [150, 100, 71.33, 50].map(value => ({
        value,
        desc: this.$t(`cpr.ratios.${value}`),
      })),
      starRatioSelected: '100',
      name: '',
      price: undefined,
      star: undefined,
      bear: undefined,
      gachapon: undefined,
      gachapon10: undefined,
      gachaCount: '',
      ratio: '',
      pricePerGacha: '',
      showTutorial: localStorage?.getItem('showTutorial') !== 'false',
      packages: require(`@/data/${this.$root.server}/packages.json`).map(v => ({
        ...v,
      })),
    }
  },
  computed: {
    total() {
      let v = this.packages.reduce(
        (acc, v) =>
          v.selected
            ? {
                price: acc.price + v.price,
                star: acc.star + v.star,
                bear: acc.bear + v.bear,
                gachapon: acc.gachapon + v.gachapon,
                gachapon10: acc.gachapon10 + v.gachapon10,
              }
            : acc,
        {
          price: 0,
          star: 0,
          bear: 0,
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
    showStarRatioInfo() {
      showDialog({
        ...this.$root.dialogSettings,
        message: this.$t('hint.cprStarRatio'),
      })
    },
    starRatioSelect(v) {
      this.starRatio = v
      this.starRatioSelected = String(v)
      this.packages.sort((a, b) => this.result(b).ratio - this.result(a).ratio)
    },
    result(v) {
      let gachaCount =
        (v.star * this.starRatio + v.bear) / 300 +
        v.gachapon +
        10 * v.gachapon10
      let result = (gachaCount / v.price) * 18
      return {
        gachaCount: Math.round(gachaCount * 100) / 100,
        ratio: Math.round(result * 100),
        pricePerGacha: Math.round((18 / result) * 100) / 100,
      }
    },
    calculate() {
      if (!this.price)
        return showToast({ message: this.$t('cpr.toast.price'), icon: 'close' })
      let v = {
        price: Number(this.price),
        star: Number(this.star || 0),
        bear: Number(this.bear || 0),
        gachapon: Number(this.gachapon || 0),
        gachapon10: Number(this.gachapon10 || 0),
      }
      let result = this.result(v)
      if (!result.gachaCount)
        return showToast({
          message: this.$t('cpr.toast.content'),
          icon: 'close',
        })

      this.gachaCount = this.$t('cpr.gachaCountNumber', [result.gachaCount])
      this.ratio = this.$t('cpr.cprNumber', [result.ratio])
      this.pricePerGacha = this.$t('cpr.pricePerGachaNumber', [
        result.pricePerGacha,
      ])
    },
    add() {
      if (!this.price)
        return showToast({ message: this.$t('cpr.toast.price'), icon: 'close' })
      this.calculate()
      if (!this.gachaCount)
        return showToast({
          message: this.$t('cpr.toast.content'),
          icon: 'close',
        })
      if (!this.name)
        return showToast({ message: this.$t('cpr.toast.name'), icon: 'close' })
      this.packages.push({
        name: this.name,
        price: Number(this.price),
        star: Number(this.star || 0),
        bear: Number(this.bear || 0),
        gachapon: Number(this.gachapon || 0),
        gachapon10: Number(this.gachapon10 || 0),
      })
      this.packages.sort((a, b) => this.result(b).ratio - this.result(a).ratio)
      this.clear()
      showToast({ message: this.$t('cpr.toast.success'), icon: 'passed' })
    },
    clear() {
      this.price = undefined
      this.star = undefined
      this.bear = undefined
      this.gachapon = undefined
      this.gachapon10 = undefined
      this.gachaCount = ''
      this.ratio = ''
      this.pricePerGacha = ''
    },
    closeTutorial() {
      this.showTutorial = false
      localStorage?.setItem('showTutorial', 'false')
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
