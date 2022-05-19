<template>
  <van-nav-bar title="信使花园" left-text="返回" left-arrow @click-left="returnHomepage" />

  <van-tabs v-model:active="active">
    <van-tab title="攻略说明">
      <van-cell-group inset title="攻略">
        <van-cell title="说明" label="本工具除了并未还原卡池特殊机制（例如「日日夜夜」100 抽赠送随机限定灵犀）以外，抽卡机制也不一定与官方完全相同，仅作娱乐之用。刷新页面即可清空数据。" />
        <van-cell title="「浮世同行」数据分析" url="https://weibo.com/2304898581/LbPP0AlN8" is-link center />
        <van-cell title="「尘封的雪影」数据分析" url="https://weibo.com/2304898581/LcrUctQEB" is-link center />
        <van-cell title="「日日夜夜」数据分析" url="https://weibo.com/2304898581/LcIFtaXwt" is-link center />
        <van-cell title="「时间的彼岸」数据分析" url="https://weibo.com/2304898581/Lmq1jEYXe" is-link center />
        <van-cell title="其他攻略" url="https://weibo.com/u/2304898581" is-link center />
      </van-cell-group>
    </van-tab>

    <van-tab title="信使花园">
      <van-cell-group inset title="卡池">
        <van-field v-model="pool.name" is-link readonly label="卡池" @click="poolSelectShow = true" />
        <van-cell title="详情" :label="poolDetail" />
      </van-cell-group>

      <van-cell-group inset title="当前状态">
        <van-cell title="水位" :value="waterLevel" center />
        <van-cell title="6 星概率" :value="possibility + '%'" is-link @click="possibilityShow = true" />
        <van-cell title="已使用羽毛笔" :value="usedGachapon" />
        <van-cell title="已使用十连收信券" :value="usedGachapon10" />
        <van-cell title="已获得心迹书简" :value="gachaRecord.length" />
      </van-cell-group>

      <van-cell-group inset title="抽卡">
        <van-cell title="收信 1 次" is-link @click="gacha1" />
        <van-cell title="收信 10 次" is-link @click="gacha10" />
      </van-cell-group>
    </van-tab>

    <van-tab title="收信记录">
      <van-dropdown-menu>
        <van-dropdown-item v-model="optionCharValue" :options="optionChar" @change="listReload" />
        <van-dropdown-item v-model="optionStarValue" :options="optionStar" @change="listReload" />
      </van-dropdown-menu>
      <van-list @load="listLoad">
        <template v-if="list.length">
          <van-cell v-for="v in list" :key="v" :title="v.name" :value="v.pool" :label="stars.slice(0, v.star)" />
        </template>
      </van-list>
    </van-tab>

    <van-tab title="灵犀统计">
      <van-dropdown-menu>
        <van-dropdown-item v-model="optionCharValue" :options="optionChar" @change="listReload" />
        <van-dropdown-item v-model="optionStarValue" :options="optionStar" @change="listReload" />
      </van-dropdown-menu>
      <van-row wrap>
        <template v-for="v in [6, 5, 4, 3]" :key="v">
          <template v-for="u in cardGot[v]" :key="u">
            <card v-if="(optionCharValue == 'all' || optionCharValue == u.char) && (optionStarValue == 'all' || optionStarValue == v)"
              :name="u.name" :star="v" :count="u.count" in-list />
          </template>
        </template>
      </van-row>
    </van-tab>
  </van-tabs>

  <van-popup v-model:show="poolSelectShow" round position="bottom">
    <van-cascader v-model="poolCascaderValue" title="请选择卡池" :options="poolSelectValue"
      @close="poolSelectShow = false" @finish="poolSelectFinish">
      <template #options-top>
        <van-notice-bar left-icon="warning-o" color="#1989fa" background="#ecf9ff" text="切换卡池后，水位将被直接清空。" />
      </template>
    </van-cascader>
  </van-popup>

  <van-config-provider :theme-vars="dialogTheme">
    <van-dialog v-model:show="possibilityShow" theme="round-button" :confirm-button-color="buttonColor" closeOnClickOverlay>
      <div class="container">
        <van-row class="content">
          <van-col span="8"><strong>星级</strong></van-col>
          <van-col span="8"><strong>概率</strong></van-col>
          <van-col span="8"><strong>已取得</strong></van-col>
        </van-row>
        <van-divider dashed />
        <van-row v-for="i in [3, 4, 5, 6]" :key="i" class="content">
          <van-col span="8">{{i}} 星</van-col>
          <van-col span="8">{{starPossibility[i]}}%</van-col>
          <van-col span="8">{{starCount[i]}}</van-col>
        </van-row>
        <van-divider />
        <van-row class="content">
          <van-col span="24" class="desc">自连续不出 6 星的第 60 抽起，每抽都会增加 6 星 10% 的出率，直到抽到 6 星、出率恢复为 2% 为止。十连收信必出 5 星或以上灵犀。</van-col>
        </van-row>
        <van-divider dashed />
        <van-row class="content">
          <van-col span="24" class="desc">如果对 5 星卡不感兴趣，或者水位大于 51，建议用单抽代替十连。</van-col>
        </van-row>
      </div>
    </van-dialog>

    <van-dialog v-model:show="gacha1Show" theme="round-button" :confirm-button-color="buttonColor" closeOnClickOverlay>
      <div class="container" v-if="typeof(gachaResult) == 'object'">
        <van-row class="content" gutter="5">
          <card :name="gachaResult.name" :star="gachaResult.star" :is-new="gachaResult.new" is-single />
        </van-row>
      </div>
    </van-dialog>

    <van-dialog v-model:show="gacha10Show" theme="round-button" :confirm-button-color="buttonColor" closeOnClickOverlay>
      <div class="container" v-if="gachaResult.length">
        <template v-for="(v, i) in [0, 1, 3, 4, 6, 7, 9]" :key="i">
          <van-row class="content" gutter="5">
            <template v-if="i % 2">
              <card :name="gachaResult[v].name" :star="gachaResult[v].star" :is-new="gachaResult[v].new" />
              <card :name="gachaResult[v + 1].name" :star="gachaResult[v + 1].star" :is-new="gachaResult[v + 1].new" />
            </template>
            <template v-else>
              <card :name="gachaResult[v].name" :star="gachaResult[v].star" :is-new="gachaResult[v].new" is-single />
            </template>
          </van-row>
        </template>
      </div>
    </van-dialog>
  </van-config-provider>
</template>

<script>
import { Cascader, DropdownMenu, DropdownItem, List } from 'vant'
import Card from '@/components/Card.vue'
let data = require('@/assets/data/card.json')

let getCardName = (star, index) => {
  let item = data.cards[star][index]
  return { name: `${data.characters[item[0]]}·${item[1]}`, char: item[0] }
}

let getFromList = (list) => {
  let random = Math.floor(list.length * Math.random())
  return list[random]
}

export default {
  components: {
    [Cascader.name]: Cascader,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
    [List.name]: List,
    Card,
  },
  data () {
    let year
    let poolSelectValue = [
      { text: '常驻卡池', value: 'common', children: [] },
      { text: '限定卡池', value: 'limited', children: [] }
    ]

    for (let i in data.common) {
      let item = data.common[i]
      poolSelectValue[0].children.push({ text: `${item.name} [${item.desc}]`, value: i })
    }

    for (let i in data.limited) {
      year = i
      let option = { text: i + ' 年', value: i, children: [] }
      for (let j in data.limited[i]) {
        let item = data.limited[i][j]
        option.children.push({ text: `${item.name} [${item.desc}]`, value: j })
      }
      poolSelectValue[1].children.push(option)
    }

    let poolIndex = data.limited[year].length - 1
    let pool = { ...data.limited[year][poolIndex] }

    let optionChar = [{ text: '不限男主', value: 'all' }]
    for (let i in data.characters)
      optionChar.push({ text: data.characters[i], value: i })

    let optionStar = [{ text: '不限星级', value: 'all' }]
    for (let i = 3; i <= 6; i ++)
      optionStar.push({ text: `${i} 星`, value: i })

    return {
      active: '攻略说明',
      pool,
      poolType: 'limited',
      poolSelectValue,
      poolCascaderValue: undefined,
      poolSelectShow: false,
      possibilityShow: false,
      gacha1Show: false,
      gacha10Show: false,
      gachaResult: undefined,
      gachaRecord: [],
      waterLevel: 0,
      starCount: { 3: 0, 4: 0, 5: 0, 6: 0 },
      cardGot: { 3: {}, 4: {}, 5: {}, 6: {} },
      usedGachapon: 0,
      usedGachapon10: 0,
      stars: '★★★★★★',
      buttonColor: 'linear-gradient(135deg, #91c4cc, #b7ddc0)',
      dialogTheme: {
        dialogFontSize: 'var(--van-font-size-md)'
      },
      optionChar,
      optionCharValue: 'all',
      optionStar,
      optionStarValue: 'all',
      list: [],
      listIndex: -1,
    }
  },
  computed: {
    poolDetail () {
      let poolDetail = ''
      if (this.poolType == 'common')
        poolDetail = this.pool.detail
      else {
        for (let star in this.pool.up) {
          poolDetail += `[${star} 星] `
          for (let i in this.pool.up[star]) {
            poolDetail += getCardName(star, this.pool.up[star][i]).name + '、'
          }
        }
        poolDetail = poolDetail.slice(0, -1)
        poolDetail += ` 将获得 ${this.pool.p ? this.pool.p : '50'}% 概率 UP。`
      }
      return poolDetail
    },
    possibility () {
      return this.waterLevel <= 60 ? 2 : Math.min(2 + (this.waterLevel - 60) * 10, 100)
    },
    starPossibility () {
      return {
        3: Math.max(60 - this.possibility, 0),
        4: Math.max(90 - Math.max(60, this.possibility), 0),
        5: Math.max(100 - Math.max(90, this.possibility), 0),
        6: this.possibility
      }
    },
  },
  methods: {
    returnHomepage () {
      this.$router.push('/')
    },
    poolSelectFinish ({ selectedOptions }) {
      this.poolSelectShow = false
      this.poolType = selectedOptions[0].value
      this.waterLevel = 0
      let v1 = selectedOptions[1].value
      let v2 = selectedOptions[2]?.value
      if (this.poolType == 'common') {
        this.pool = { ...data.common[v1] }
      } else {
        this.pool = { ...data.limited[v1][v2] }
      }
    },
    gacha1 () {
      this.usedGachapon += 1
      this.gachaResult = this.gacha()
      this.gacha1Show = true
    },
    gacha10 () {
      this.usedGachapon10 += 1
      let has5 = false
      let res = []
      for (let i = 0; i < 10; i ++) {
        let item = this.gacha(i == 9 && !has5)
        if (item.star >= 5) has5 = true
        res.push(item)
      }
      this.gachaResult = res
      this.gacha10Show = true
    },
    gacha (must5) {
      let res = this.gachaInner(must5)
      let { name, char } = getCardName(res.star, res.index)
      res.name = name
      res.char = char
      res.pool = this.pool.name

      if (this.cardGot[res.star][res.index])
        this.cardGot[res.star][res.index].count += 1
      else {
        this.cardGot[res.star][res.index] = { count: 1, name: res.name, char: res.char }
        res.new = true
      }

      this.list = []
      this.listIndex = this.gachaRecord.length
      this.gachaRecord.push(res)

      return res
    },
    gachaInner (must5) {
      let random = Math.random() * 100
      let random2 = Math.random() * 100
      let p = this.pool.p === undefined ? 50 : this.pool.p
      if (random <= this.possibility) {
        this.waterLevel = 0
        this.starCount[6] += 1
        if (random2 <= p && this.pool.up && this.pool.up['6'])
          return { star: 6, index: getFromList(this.pool.up['6']) }
        else
          return { star: 6, index: getFromList(data.common[this.pool.common]['6']) }
      }
      this.waterLevel += 1
      if (random <= 60 && !must5) {
        this.starCount[3] += 1
        return { star: 3, index: getFromList(data.common[this.pool.common]['3']) }
      }
      if (random <= 90 && !must5) {
        this.starCount[4] += 1
        return { star: 4, index: getFromList(data.common[this.pool.common]['4']) }
      }
      this.starCount[5] += 1
      if (random2 <= p && this.pool.up && this.pool.up['5'])
        return { star: 5, index: getFromList(this.pool.up['5']) }
      else
        return { star: 5, index: getFromList(data.common[this.pool.common]['5']) }
    },
    listReload () {
      this.list = []
      this.listIndex = this.gachaRecord.length - 1
      this.listLoad()
    },
    listLoad () {
      let count = 0
      for (let i = this.listIndex; i >= 0 && count < 10; i --) {
        this.listIndex = i - 1
        if (this.optionCharValue == 'all' || this.optionCharValue == this.gachaRecord[i].char)
          if (this.optionStarValue == 'all' || this.optionStarValue == this.gachaRecord[i].star) {
            this.list.push(this.gachaRecord[i])
            count ++
          }
      }
    }
  }
}
</script>

<style scoped>
.van-col {
  text-align: center;
}
</style>