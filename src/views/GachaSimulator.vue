<template>
  <navbar :title="$t('route.gacha')" hint="gacha" can-return />

  <van-tabs v-model:active="active" sticky offset-top="46">
    <van-tab :title="$t('gacha.tabbar[0]')">
      <van-cell-group inset :title="$t('gacha.pool')">
        <van-field
          v-model="pool.name"
          :label="$t('gacha.pool')"
          readonly
          is-link
          @click="poolSelectShow = true"
        />
        <van-cell :title="$t('common.detail')" :label="poolDetail" />
        <tutorial-cell
          v-if="pool.tutorial !== undefined"
          :message="`gacha[${pool.tutorial}]`"
        />
      </van-cell-group>

      <van-cell-group inset :title="$t('common.currentStatus')">
        <van-cell
          :title="$t('gacha.waterLevel')"
          :value="waterLevel"
          is-link
          @click="showWaterlevelInfo"
        />
        <van-cell
          :title="$t('gacha.star6Possibility')"
          :value="$t('common.percentage', [star6Possibility])"
          is-link
          @click="possibilityShow = true"
        />
        <van-cell
          :title="$t('gacha.gachaTime.total')"
          :value="
            $t('gacha.gachaTime.number', [
              ...usedGachapon.total,
              gachaTime.total,
            ])
          "
        />
        <van-cell
          :title="$t('gacha.gachaTime.pool')"
          :value="
            $t('gacha.gachaTime.number', [...usedGachapon.pool, gachaTime.pool])
          "
        />
        <van-cell :title="$t('items.100013')" :value="letter.common" />
        <van-cell
          v-if="pool.limitedLetter"
          :title="$t(`items.${pool.limitedLetter}`)"
          :value="letter.limited"
        />
      </van-cell-group>

      <van-cell-group :title="$t('gacha.buy.title')" inset>
        <van-cell
          :title="$t('gacha.buy.common')"
          is-link
          @click="shopShow.common = true"
        />
        <van-cell
          v-if="Object.keys(limitedShop).length"
          :title="$t('gacha.buy.limited')"
          is-link
          @click="shopShow.limited = true"
        />
        <van-cell
          v-if="pool.pickPrice || pool.pickTime"
          :title="$t('gacha.buy.pick')"
          is-link
          @click="shopShow.pick = true"
        />
      </van-cell-group>

      <van-cell-group :title="$t('common.gacha')" inset>
        <van-cell :title="$t('gacha.gacha.1')" is-link @click="gacha1" />
        <van-cell :title="$t('gacha.gacha.10')" is-link @click="gacha10" />
      </van-cell-group>
    </van-tab>

    <van-tab :title="$t('gacha.tabbar[1]')">
      <van-dropdown-menu>
        <van-dropdown-item
          v-model="optionCharValue"
          :options="optionChar"
          @change="listReload"
        />
        <van-dropdown-item
          v-model="optionStarValue"
          :options="optionStar"
          @change="listReload"
        />
      </van-dropdown-menu>
      <van-list @load="listLoad">
        <template v-if="list.length">
          <van-cell v-for="v in list" :key="v" :value="v.pool">
            <template #title>
              <van-tag plain>{{ v.star }}</van-tag>
              {{ v.name }}
              <van-tag v-if="v.single" plain>
                {{ $t('gacha.tag.single') }}
              </van-tag>
              <van-tag v-if="v.shop">{{ $t('gacha.tag.shop') }}</van-tag>
              <van-tag v-if="v.pick">{{ $t('gacha.tag.pick') }}</van-tag>
              <van-tag v-if="v.random">{{ $t('gacha.tag.random') }}</van-tag>
            </template>
          </van-cell>
        </template>
      </van-list>
    </van-tab>

    <van-tab :title="$t('gacha.tabbar[2]')">
      <van-dropdown-menu>
        <van-dropdown-item
          v-model="optionCharValue"
          :options="optionChar"
          @change="listReload"
        />
        <van-dropdown-item
          v-model="optionStarValue"
          :options="optionStar"
          @change="listReload"
        />
      </van-dropdown-menu>
      <van-row wrap>
        <template v-for="v in [6, 5, 4, 3]" :key="v">
          <template v-for="u in cardsGot[v]" :key="u">
            <gacha-simulator-card
              v-if="
                (optionCharValue == 'all' || optionCharValue == u.char) &&
                (optionStarValue == 'all' || optionStarValue == v)
              "
              :name="u.name"
              :star="v"
              :count="u.count"
              in-list
            />
          </template>
        </template>
      </van-row>
    </van-tab>

    <van-tab :title="$t('gacha.tabbar[3]')">
      <van-radio-group v-model="animationType">
        <van-cell-group inset :title="$t('gacha.settings.animation')">
          <van-cell
            v-for="v in animationData"
            :key="v"
            :title="v.name"
            clickable
            @click="animationType = v.value"
          >
            <template #right-icon>
              <van-radio :name="v.value" />
            </template>
          </van-cell>
          <van-cell v-if="animationType" :title="$t('gacha.settings.shining')">
            <template #right-icon>
              <van-switch v-model="shiningType" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-tab>
  </van-tabs>

  <van-popup v-model:show="poolSelectShow" round position="bottom">
    <van-cascader
      v-model="poolCascaderValue"
      :title="$t('gacha.choosePool')"
      :options="poolSelectValue"
      @close="poolSelectShow = false"
      @finish="changeCurrentPool"
    />
  </van-popup>

  <van-popup v-model:show="shopShow.common" round position="bottom">
    <van-picker :columns="shopColumn" @confirm="shopBuy" />
    <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o">
      {{ $t('hint.gachaBuyCommon') }}
    </van-notice-bar>
  </van-popup>

  <van-popup v-model:show="shopShow.limited" round position="bottom">
    <van-picker :columns="limitedColumn" @confirm="limitedShopBuy" />
  </van-popup>

  <van-popup v-model:show="shopShow.pick" round position="bottom">
    <van-picker :columns="pickColumn" @confirm="pickShopBuy" />
  </van-popup>

  <van-config-provider :theme-vars="dialogTheme">
    <van-dialog v-model:show="possibilityShow" closeOnClickOverlay>
      <div class="container">
        <van-row class="content center-row">
          <van-col span="8" v-for="i in [0, 1, 2]" :key="i">
            <strong>{{ $t(`gacha.possibilityTitle[${i}]`) }}</strong>
          </van-col>
        </van-row>
        <van-divider dashed />
        <van-row v-for="i in [3, 4, 5, 6]" :key="i" class="content center-row">
          <van-col span="8">{{ $t('gacha.star', [i]) }}</van-col>
          <van-col span="8">
            {{ $t('common.percentage', [starsPossibility[i]]) }}
          </van-col>
          <van-col span="8">{{ starsGotFromGacha[i] }}</van-col>
        </van-row>
      </div>
      <van-divider />
      <div class="container">
        <van-row class="content" v-for="i in [0, 1]" :key="i">
          <van-col span="24" class="desc">
            {{ $t(`hint.gachaPossibility[${i}]`) }}
          </van-col>
        </van-row>
      </div>
    </van-dialog>

    <van-dialog
      v-model:show="cardNewlyGotShow"
      closeOnClickOverlay
      @closed="checkRandomTimeReached"
    >
      <div class="container" v-if="cardNewlyGot">
        <van-row class="content" gutter="5">
          <gacha-simulator-card
            :index="0"
            :name="cardNewlyGot.name"
            :star="cardNewlyGot.star"
            :is-new="cardNewlyGot.new"
            :ani="animationType ? 1 : 0"
            :shining="shiningType"
            is-single
          />
        </van-row>
      </div>
    </van-dialog>

    <van-dialog
      v-model:show="cardsNewlyGotShow"
      closeOnClickOverlay
      @closed="checkRandomTimeReached"
    >
      <div class="container" v-if="cardsNewlyGot.length">
        <template v-for="(v, i) in [0, 1, 3, 4, 6, 7, 9]" :key="i">
          <van-row class="content" gutter="5">
            <template v-if="i % 2">
              <gacha-simulator-card
                :index="v"
                :name="cardsNewlyGot[v].name"
                :star="cardsNewlyGot[v].star"
                :is-new="cardsNewlyGot[v].new"
                :ani="animationType"
                :shining="shiningType"
              />
              <gacha-simulator-card
                :index="v + 1"
                :name="cardsNewlyGot[v + 1].name"
                :star="cardsNewlyGot[v + 1].star"
                :is-new="cardsNewlyGot[v + 1].new"
                :ani="animationType"
                :shining="shiningType"
              />
            </template>
            <template v-else>
              <gacha-simulator-card
                :index="v"
                :name="cardsNewlyGot[v].name"
                :star="cardsNewlyGot[v].star"
                :is-new="cardsNewlyGot[v].new"
                :ani="animationType"
                :shining="shiningType"
                is-single
              />
            </template>
          </van-row>
        </template>
      </div>
    </van-dialog>
  </van-config-provider>
</template>

<script>
import {
  showDialog,
  showNotify,
  Cascader,
  DropdownMenu,
  DropdownItem,
  List,
  Tag,
} from 'vant'
import GachaSimulatorCard from '@/components/Card.vue'
import Navbar from '@/components/Navbar.vue'
import TutorialCell from '@/components/TutorialCell.vue'

export default {
  name: 'GachaSimulator',
  components: {
    [Cascader.name]: Cascader,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [List.name]: List,
    [Tag.name]: Tag,
    GachaSimulatorCard,
    Navbar,
    TutorialCell,
  },
  data() {
    // 初始化卡池数据
    let d = {
        characters: [0, 1, 2, 3, 4].map(i => this.$t(`characters[${i}]`)),
        ...require(`@/data/${this.$root.server}/cards.json`),
      },
      year = 1919,
      poolSelectValue = ['common', 'limited'].map(value => ({
        text: this.$t(`gacha.poolType.${value}`),
        value,
        children: [],
      }))

    poolSelectValue[0].children = d.common.map((item, value) => ({
      text: this.$t('gacha.poolName', [item.name, item.desc]),
      value,
    }))

    for (let i in d.limited) {
      year = Math.max(year, i)
      poolSelectValue[1].children.push({
        text: this.$t('gacha.poolYear', [i]),
        value: i,
        children: d.limited[i].map((item, value) => ({
          text: this.$t('gacha.poolName', [item.name, item.desc]),
          value,
        })),
      })
    }

    // 初始化所选卡池，及其限定灵犀兑换商店与卡池描述
    let poolIndex = d.limited[year].length - 1
    let pool = { ...d.limited[year][poolIndex] }
    let limitedShop = this.initLimitedShop(pool)
    let poolDetail = this.initPoolDetail(pool, d)

    return {
      d,
      pool,
      poolType: 'limited',
      poolDetail,
      cardNewlyGot: undefined,
      cardsNewlyGot: [],

      // 统计数据
      cardsRecord: [],
      waterLevel: 0,
      letter: { common: 0, limited: 0 },
      usedGachapon: { total: [0, 0], pool: [0, 0] }, // [收取一次, 收取十次]
      starsGotFromGacha: { 3: 0, 4: 0, 5: 0, 6: 0 },
      cardsGot: { 3: {}, 4: {}, 5: {}, 6: {} },

      // 兑换灵犀商店数据
      shopColumn: [5, 6].map(star => ({
        text: this.$t('gacha.buy.price', [
          star,
          star == 5 ? 80 : 180,
          this.$t('items.100013'),
        ]),
        value: star - 5,
        star,
        children: d.common[0][star].map((index, value) => ({
          text: this.getCardInfo(star, index, d).name,
          value,
          index,
        })),
      })),
      limitedShop,

      /* Vant 组件使用的数据 */
      // 标签栏
      active: 0,
      // 级联选择器
      poolSelectShow: false,
      poolSelectValue,
      poolCascaderValue: undefined,
      // 对话框, 弹出框
      possibilityShow: false,
      shopShow: { common: false, limited: false, pick: false },
      cardNewlyGotShow: false,
      cardsNewlyGotShow: false,
      // 下拉框
      optionChar: [
        { text: this.$t('gacha.settings.allchar'), value: 'all' },
        ...d.characters.map((text, value) => ({ text, value })),
      ],
      optionCharValue: 'all',
      optionStar: [
        { text: this.$t('gacha.settings.allstar'), value: 'all' },
        ...[3, 4, 5, 6].map(value => ({
          text: this.$t('gacha.star', [value]),
          value,
        })),
      ],
      optionStarValue: 'all',
      // 列表
      list: [],
      listIndex: -1,
      // 自定义样式
      dialogTheme: {
        dialogFontSize: 'var(--van-font-size-md)',
      },

      animationType_: undefined,
      animationData: [0, 1, 2].map(value => ({
        name: this.$t(`gacha.settings.animations[${value}]`),
        value,
      })),
      shiningType_: undefined,
    }
  },
  computed: {
    star6Possibility() {
      return this.waterLevel < 60
        ? 2
        : Math.min(12 + (this.waterLevel - 60) * 10, 100)
    },
    starsPossibility() {
      return {
        3: Math.max(60 - this.star6Possibility, 0),
        4: Math.max(90 - Math.max(60, this.star6Possibility), 0),
        5: Math.max(100 - Math.max(90, this.star6Possibility), 0),
        6: this.star6Possibility,
      }
    },
    gachaTime() {
      return {
        total: this.usedGachapon.total[0] + this.usedGachapon.total[1] * 10,
        pool: this.usedGachapon.pool[0] + this.usedGachapon.pool[1] * 10,
      }
    },
    poolLetterName() {
      return this.getPoolLetterName(this.pool)
    },
    limitedShopPrice() {
      let price = {}
      for (let star in this.limitedShop)
        price[star] = this.pool.price?.[star]
          ? this.pool.price[star]
          : star == 5
          ? 80
          : 180
      return price
    },
    limitedColumn() {
      let column = []
      for (let star in this.limitedShop)
        column.push({
          text: this.$t('gacha.buy.price', [
            star,
            this.limitedShopPrice[star],
            this.poolLetterName,
          ]),
          value: star,
          star,
          children: this.limitedShop[star].map((index, value) => ({
            text: this.getCardInfo(star, index).name,
            value,
            index,
          })),
        })
      return column
    },
    pickColumn() {
      if (!this.pool.pickPrice && !this.pool.pickTime) return []
      // 目前只有 6 星卡池开启过自选
      let cards = this.pool.up[6].map((index, value) => ({
        text: this.getCardInfo(6, index).name,
        value,
        index,
      }))
      let column = []
      if (this.pool.pickPrice)
        column.push({
          text: `${this.pool.pickPrice} ${this.poolLetterName}`,
          children: cards,
          type: 1,
        })
      if (this.pool.pickTime)
        column.push({
          text: this.$t('gacha.buy.time', [this.pool.pickTime]),
          children: cards,
          type: 2,
        })
      return column.map((item, value) => ({ ...item, value }))
    },
    // Some LocalStorage Shit
    animationType: {
      get() {
        if (this.animationType_ === undefined) {
          let data = localStorage?.getItem('GachaSimAnimationType')
          return data !== null ? Number(data) : 2
        }
        return this.animationType_
      },
      set(v) {
        this.animationType_ = v
        localStorage?.setItem('GachaSimAnimationType', v)
      },
    },
    shiningType: {
      get() {
        if (this.shiningType_ === undefined) {
          let data = localStorage?.getItem('GachaSimShiningType')
          return data == 'false' ? false : true
        }
        return this.shiningType_
      },
      set(v) {
        this.shiningType_ = v
        localStorage?.setItem('GachaSimShiningType', v)
      },
    },
  },
  methods: {
    /**
     * @param {string | number} star 灵犀星级
     * @param {number} index 灵犀在数组 cards 中的第二维下标
     * @param {object?} data 未将 d 绑定到 this 上时需要将 d 传入
     * @return {object} \{name, char\} 灵犀的显示名称与所属角色
     */
    getCardInfo(star, index, data) {
      let [char, name] = (this.d || data).cards[star][index]
      return {
        name: this.$t('gacha.cardName', [
          (this.d || data).characters[char],
          name,
        ]),
        char,
      }
    },
    getPoolLetterName(pool) {
      return pool.limitedLetter
        ? this.$t(`items.${pool.limitedLetter}`)
        : this.$t('items.100013')
    },
    getRandomCardFromList(list) {
      return list[Math.floor(list.length * Math.random())]
    },
    showWaterlevelInfo() {
      showDialog({
        ...this.$root.dialogSettings,
        title: this.$t('gacha.waterLevel'),
        message: this.$t('hint.gachaWaterLevel'),
      })
    },
    gainCard(star, index, args) {
      star = `${star}`

      let isNew = false
      if (this.cardsGot[star][index]) this.cardsGot[star][index].count += 1
      else {
        this.cardsGot[star][index] = {
          count: 1,
          ...this.getCardInfo(star, index),
        }
        isNew = true
      }

      let { name, char } = this.getCardInfo(star, index)
      let item = {
        star: Number(star),
        name,
        char,
        pool: this.pool.name,
        new: isNew,
        ...args,
      }

      this.list = []
      this.listIndex = this.cardsRecord.length
      this.cardsRecord.push(item)
      return item
    },
    showCardNewlyGot(card) {
      this.cardNewlyGot = card
      this.cardNewlyGotShow = true
    },
    showCardsNewlyGot(cards) {
      this.cardsNewlyGot = cards
      this.cardsNewlyGotShow = true
    },
    /**
     * 初始化卡池详情. 初始化或修改卡池时都需要调用该函数.
     * @param {object} pool
     * @param {object?} data 未将 d 绑定到 this 上时需要将 d 传入
     */
    initPoolDetail(pool, data) {
      let poolDetail = ''
      let generateCardList = list => {
        let result = ''
        for (let star in list) {
          result += this.$t('gacha.desc.cardStar', [star])
          for (let i in list[star])
            result += this.$t('gacha.desc.cardName', [
              this.getCardInfo(star, list[star][i], data).name,
            ])
        }
        return result.slice(0, -1)
      }
      if (pool.up)
        poolDetail += this.$t('gacha.desc.up', [
          generateCardList(pool.up),
          pool.p ? pool.p : 50,
        ])
      if (pool.addCommon)
        poolDetail += this.$t('gacha.desc.addCommon', [
          generateCardList(pool.addCommon),
        ])
      if (pool.noShop) poolDetail += this.$t('gacha.desc.noShop')
      if (pool.add)
        poolDetail += this.$t('gacha.desc.add', [generateCardList(pool.add)])
      if (pool.inherit)
        poolDetail += this.$t('gacha.desc.inherit', [pool.inherit])
      if (pool.limitedLetter)
        poolDetail += this.$t('gacha.desc.limitedLetter', [
          this.getPoolLetterName(pool),
        ])
      if (pool.randomTime)
        poolDetail += this.$t('gacha.desc.randomTime', [pool.randomTime])
      if (pool.pickTime)
        poolDetail += this.$t('gacha.desc.pickTime', [pool.pickTime])
      if (pool.pickPrice)
        poolDetail += this.$t('gacha.desc.pickTime', [
          pool.pickPrice,
          this.poolLetterName,
        ])
      return poolDetail + (pool.detail ? pool.detail : '')
    },
    initLimitedShop(pool) {
      let shop = {}
      if (pool.noShop) return shop
      if (pool.up) for (let i in pool.up) shop[i] = [].concat(pool.up[i])
      if (pool.addCommon)
        for (let i in pool.addCommon)
          shop[i] = shop[i].concat(pool.addCommon[i])
      let res = { ...shop }
      if (pool.maxBuy)
        for (let i = 1; i < pool.maxBuy; i++)
          for (let j in res) res[j] = res[j].concat(shop[j])
      return res
    },
    shopBuy(v) {
      this.shopShow.common = false
      let star = v.selectedOptions[0].star
      let index = v.selectedOptions[1].index
      let price = star == 5 ? 80 : 180

      if (this.letter.common < price)
        return showNotify(
          this.$t('gacha.notify.failure', [this.$t('items.100013')])
        )
      this.letter.common -= price

      showNotify({ message: this.$t('gacha.notify.success'), type: 'success' })
      let item = this.gainCard(star, index, {
        pool: this.$t('gacha.commonPool'),
        shop: true,
      })
      this.showCardNewlyGot(item)
    },
    limitedShopBuy(v) {
      this.shopShow.limited = false
      let star = v.selectedOptions[0].star
      let index = v.selectedOptions[1].index
      let price = this.limitedShopPrice[star]

      if (this.pool.limitedLetter) {
        if (this.letter.limited < price)
          return showNotify(
            this.$t('gacha.notify.failure', [this.poolLetterName])
          )
        this.letter.limited -= price
      } else {
        if (this.letter.common < price)
          return showNotify(
            this.$t('gacha.notify.failure', [this.$t('items.100013')])
          )
        this.letter.common -= price
      }

      showNotify({ message: this.$t('gacha.notify.success'), type: 'success' })
      let arrayIndex = v.selectedValues[1]
      this.limitedShop[star].splice(arrayIndex, 1)
      if (this.limitedShop[star].length == 0) delete this.limitedShop[star]
      let item = this.gainCard(star, index, {
        shop: true,
      })
      this.showCardNewlyGot(item)
    },
    pickShopBuy(v) {
      this.shopShow.pick = false
      let type = v.selectedOptions[0].type
      let index = v.selectedOptions[1].index
      if (type == 1) {
        // 使用书简兑换
        if (this.pool.limitedLetter) {
          if (this.letter.limited < this.pool.pickPrice)
            return showNotify(
              this.$t('gacha.notify.failure', [this.poolLetterName])
            )
          this.letter.limited -= this.pool.pickPrice
        } else {
          if (this.letter.common < this.pool.pickPrice)
            return showNotify(
              this.$t('gacha.notify.failure', [this.$t('items.100013')])
            )
          this.letter.common -= this.pool.pickPrice
        }
        this.pool.pickPrice = undefined
      } else if (type == 2) {
        // 到达抽数赠送
        if (this.gachaTime.pool < this.pool.pickTime)
          return showNotify(this.$t('gacha.notify.pickFailure'))
        this.pool.pickTime = undefined
      }

      showNotify({ message: this.$t('gacha.notify.success'), type: 'success' })
      let item = this.gainCard(6, index, {
        pick: true,
      })
      this.showCardNewlyGot(item)
    },
    changeCurrentPool({ selectedOptions }) {
      let previousInherit = this.pool.inherit
      let previousType = this.poolType

      this.poolSelectShow = false
      this.poolType = selectedOptions[0].value

      let v1 = selectedOptions[1].value
      let v2 = selectedOptions[2]?.value

      if (this.poolType == 'common') this.pool = { ...this.d.common[v1] }
      else this.pool = { ...this.d.limited[v1][v2] }

      this.limitedShop = this.initLimitedShop(this.pool)
      this.poolDetail = this.initPoolDetail(this.pool)

      if (
        this.pool.name != previousInherit &&
        (this.poolType != 'common' || previousType != 'common')
      )
        this.waterLevel = 0

      this.letter.common += this.letter.limited
      this.letter.limited = 0
      this.usedGachapon.pool = [0, 0]
    },
    gacha1() {
      this.usedGachapon.total[0] += 1
      this.usedGachapon.pool[0] += 1
      this.showCardNewlyGot(this.gacha(true, false))
    },
    gacha10() {
      this.usedGachapon.total[1] += 1
      this.usedGachapon.pool[1] += 1
      let has5 = false
      let res = []
      for (let i = 0; i < 10; i++) {
        let item = this.gacha(false, i == 9 && !has5)
        if (item.star >= 5) has5 = true
        res.push(item)
      }
      this.showCardsNewlyGot(res)
    },
    gacha(single, must5) {
      let res = this.gachaInner(must5)
      let { star, index } = res
      let item = this.gainCard(star, index, {
        single,
      })
      this.starsGotFromGacha[star] += 1

      if (this.pool.limitedLetter) this.letter.limited += 1
      else this.letter.common += 1

      return item
    },
    gachaInner(must5) {
      let random = Math.random() * 100 // 决定星级
      let random2 = Math.random() * 100 // 决定是否歪卡
      let p = this.pool.p ? this.pool.p : 50
      this.waterLevel += 1

      if (random <= this.star6Possibility) {
        this.waterLevel = 0
        let list = []
        if (random2 <= p && this.pool.up && this.pool.up['6'])
          list = this.pool.up['6']
        else {
          list = this.d.common[this.pool.common]['6']
          if (this.pool.addCommon && this.pool.addCommon['6'])
            list = list.concat(this.pool.addCommon['6'])
        }
        return { star: 6, index: this.getRandomCardFromList(list) }
      }

      if (random <= 60 && !must5)
        return {
          star: 3,
          index: this.getRandomCardFromList(
            this.d.common[this.pool.common]['3']
          ),
        }

      if (random <= 90 && !must5)
        return {
          star: 4,
          index: this.getRandomCardFromList(
            this.d.common[this.pool.common]['4']
          ),
        }

      let list = []
      if (random2 <= p && this.pool.up && this.pool.up['5'])
        list = this.pool.up['5']
      else {
        list = this.d.common[this.pool.common]['5']
        if (this.pool.addCommon && this.pool.addCommon['5'])
          list = list.concat(this.pool.addCommon['5'])
      }
      return { star: 5, index: this.getRandomCardFromList(list) }
    },
    checkRandomTimeReached() {
      if (!this.pool.randomTime) return
      if (this.gachaTime.pool < this.pool.randomTime) return
      // 目前只有 6 星卡池具有此机制
      let index = this.getRandomCardFromList(this.pool.up['6'])
      let item = this.gainCard(6, index, {
        random: true,
      })
      this.showCardNewlyGot(item)
      this.pool.randomTime = undefined
    },
    listReload() {
      this.list = []
      this.listIndex = this.cardsRecord.length - 1
      this.listLoad()
    },
    listLoad() {
      let count = 0
      for (let i = this.listIndex; i >= 0 && count < 20; i--) {
        this.listIndex = i - 1
        if (
          (this.optionCharValue == 'all' ||
            this.optionCharValue == this.cardsRecord[i].char) &&
          (this.optionStarValue == 'all' ||
            this.optionStarValue == this.cardsRecord[i].star)
        ) {
          this.list.push(this.cardsRecord[i])
          count++
        }
      }
    },
  },
}
</script>

<style scoped>
.center-row .van-col {
  text-align: center;
}
</style>
