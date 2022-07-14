<template>
  <navbar title="灵犀养成计算器" can-return>
    <van-icon
      v-if="card.length > 1 && active"
      name="delete-o"
      color="red"
      @click="removeCard(active - 1)"
    />
  </navbar>

  <van-tabs v-model:active="active" sticky offset-top="46">
    <van-tab title="计算">
      <van-cell-group inset title="当前状态">
        <van-field v-model="current.coin" type="number" label="极光币" autocomplete="off" />
        <van-field v-model="current.初心" type="number" label="初心" autocomplete="off" />
        <van-field v-model="current.慕心" type="number" label="慕心" autocomplete="off" />
        <van-field v-model="current.恋心" type="number" label="恋心" autocomplete="off" />
        <van-field v-model="current.眩光沙砾" type="number" label="眩光沙砾" autocomplete="off" />
        <van-field v-model="current.稀愿珍宝" type="number" label="稀愿珍宝" autocomplete="off" />
        <van-field v-model="current.心愿海螺" type="number" label="心愿海螺" autocomplete="off" />
        <van-cell title="外婆小铺双倍">
          <template #right-icon><van-switch v-model="grandmaDouble" size="24" /></template>
        </van-cell>
      </van-cell-group>

      <van-cell-group title=" " inset>
        <van-cell title="添加灵犀" @click="addCard" center is-link />
        <van-cell title="计算" @click="calculate" center is-link />
      </van-cell-group>

      <van-cell-group title="所需资源" inset>
        <van-cell title="极光币" :value="coin" />
        <van-cell title="经验" :value="exp" />
        <van-cell title="折合为慕心" :value="慕心" icon="arrow" />
        <van-cell title="眩光沙砾" :value="眩光沙砾" />
        <van-cell title="稀愿珍宝" :value="稀愿珍宝" />
        <van-cell title="心愿海螺" :value="心愿海螺" />
      </van-cell-group>

      <van-cell-group title="预计刷取" inset>
        <van-cell
          title=""
          label="刷取副本及其掉落内容按日常副本及其保底计。注意：外婆小铺 6-7 使用「重现五次」才有保底。"
        />
        <van-cell title="遇见极光 5" label="10 灵感 = 7200 极光币" :value="遇见极光" center />
        <van-cell title="遇见初心 5" label="10 灵感 = 4 慕心" :value="遇见初心" center />
        <van-cell title="遇见铭迹 5" label="10 灵感 = 30 眩光沙砾" :value="遇见铭迹" center />
        <van-cell
          title="外婆小铺 3-7"
          :label="`7 灵感 ≈ ${grandmaDouble ? 2 : 1} 稀愿珍宝`"
          :value="外婆小铺3"
          center
        />
        <van-cell
          title="外婆小铺 6-7"
          :label="`40 灵感 ≈ ${grandmaDouble ? 2 : 1} 心愿海螺 + ${
            grandmaDouble ? 10 : 5
          } 眩光沙砾`"
          :value="外婆小铺6"
          center
        />
        <van-cell title="花费灵感" :value="灵感" />
      </van-cell-group>
    </van-tab>
    <template v-for="(v, i) in card" :key="v">
      <van-tab :title="`灵犀 ${i + 1}`">
        <van-cell-group title="当前状态" inset>
          <van-cell title="星级" center>
            <template #right-icon
              ><van-stepper
                v-model="v.current.star"
                integer
                min="1"
                max="6"
                @change="v.target.star = v.current.star"
            /></template>
          </van-cell>
          <van-cell title="开花" center>
            <template #right-icon
              ><van-stepper v-model="v.current.rank" integer min="0" max="5"
            /></template>
          </van-cell>
          <van-cell title="等级" center>
            <template #right-icon
              ><van-stepper
                v-model="v.current.level"
                integer
                min="1"
                :max="maxLevel(v.current.star)"
            /></template>
          </van-cell>
          <van-cell v-if="isBreakAvailable(v.current)" title="已突破" icon="arrow">
            <template #right-icon><van-switch v-model="v.current.isBreak" size="24" /></template>
          </van-cell>
          <template v-for="i in [0, 1, 2]" :key="i">
            <template v-if="v.current.rank >= i">
              <van-cell :title="`铭迹 ${i + 1} 星级`" center>
                <template #right-icon
                  ><van-stepper v-model="v.current.skill[i].star" integer min="0" max="4"
                /></template>
              </van-cell>
              <van-cell v-if="v.current.skill[i].star" :title="`铭迹 ${i + 1} 等级`" center>
                <template #right-icon
                  ><van-stepper
                    v-model="v.current.skill[i].level"
                    integer
                    min="1"
                    :max="maxSkillLevel(v.current.skill[i].star)"
                /></template>
              </van-cell>
            </template>
          </template>
        </van-cell-group>

        <van-cell-group title="养成目标" inset>
          <van-cell v-if="v.current.star > 3" title="星级" center>
            <template #right-icon
              ><van-stepper v-model="v.target.star" integer :min="v.current.star" max="6"
            /></template>
          </van-cell>
          <van-cell title="开花" center>
            <template #right-icon
              ><van-stepper v-model="v.target.rank" integer :min="v.current.rank" max="5"
            /></template>
          </van-cell>
          <van-cell title="等级" center>
            <template #right-icon
              ><van-stepper
                v-model="v.target.level"
                integer
                :min="v.current.level"
                :max="maxLevel(v.target.star)"
            /></template>
          </van-cell>
          <van-cell v-if="isBreakAvailable(v.target)" title="已突破" icon="arrow">
            <template #right-icon><van-switch v-model="v.target.isBreak" size="24" /></template>
          </van-cell>
          <van-cell v-if="v.current.star >= 5" title="二段光影">
            <template #right-icon><van-switch v-model="v.target.second" size="24" /></template>
          </van-cell>
          <template v-for="i in [0, 1, 2]" :key="i">
            <template v-if="v.target.rank >= i">
              <van-cell :title="`铭迹 ${i + 1} 星级`" center>
                <template #right-icon
                  ><van-stepper
                    v-model="v.target.skill[i].star"
                    integer
                    :min="v.current.skill[i].star"
                    max="4"
                /></template>
              </van-cell>
              <van-cell v-if="v.target.skill[i].star" :title="`铭迹 ${i + 1} 等级`" center>
                <template #right-icon
                  ><van-stepper
                    v-model="v.target.skill[i].level"
                    integer
                    :min="
                      v.current.skill[i].star < v.target.skill[i].star
                        ? 1
                        : v.current.skill[i].level
                    "
                    :max="maxSkillLevel(v.target.skill[i].star)"
                /></template>
              </van-cell>
            </template>
          </template>
        </van-cell-group>
      </van-tab>
    </template>
  </van-tabs>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
let levelResource = require('@/assets/data/levelResource.json')
let skillResource = require('@/assets/data/skillResource.json')
let levelInitial = require('@/assets/data/levelInitial.json')

export default {
  name: 'Level',
  components: {
    Navbar,
  },
  data() {
    return {
      active: 0,
      card: [],
      current: {
        coin: 0,
        初心: 0,
        慕心: 0,
        恋心: 0,
        眩光沙砾: 0,
        稀愿珍宝: 0,
        心愿海螺: 0,
      },
      grandmaDouble: false,
      coin: undefined,
      exp: undefined,
      眩光沙砾: undefined,
      稀愿珍宝: undefined,
      心愿海螺: undefined,
      遇见极光: undefined,
      遇见初心: undefined,
      遇见铭迹: undefined,
      外婆小铺3: undefined,
      外婆小铺6: undefined,
    }
  },
  mounted() {
    this.addCard()
  },
  computed: {
    慕心() {
      return Math.ceil(this.exp / 2000) || undefined
    },
    灵感() {
      return (
        10 * (this.遇见极光 + this.遇见初心 + this.遇见铭迹) +
          7 * this.外婆小铺3 +
          8 * this.外婆小铺6 || undefined
      )
    },
  },
  methods: {
    isBreakAvailable(status) {
      let { star, level } = status
      return star >= 4 && (level == 20 || level == 40 || level == 60)
    },
    maxLevel(star) {
      if (star >= 4) return 60 + (star - 4) * 10
      return 20
    },
    maxSkillLevel(skillStar) {
      return 30 + (skillStar - 1) * 10
    },
    addCard() {
      this.card.push(JSON.parse(JSON.stringify(levelInitial)))
    },
    removeCard(i) {
      this.card.splice(i, 1)
      this.active = 0
    },
    calculate() {
      this.coin = 0
      this.exp = 0
      this.眩光沙砾 = 0
      this.稀愿珍宝 = 0
      this.心愿海螺 = 0

      for (let i in this.card) {
        let v = this.card[i]

        // 升星
        let targetStarDiff = u => v.target.star >= u && v.current.star < u
        if (targetStarDiff(5)) this.coin += 30000
        if (targetStarDiff(6)) this.coin += 60000

        // 光影
        if (v.target.second) this.coin += 30000

        // 升级
        let currentE = levelResource[v.current.level].exp
        let targetE = levelResource[v.target.level].exp
        this.exp += targetE - currentE

        let getCoin = status => {
          let { level, isBreak } = status
          let coin = levelResource[level].coin
          if (level == 20 && isBreak) coin += 3000
          if (level == 40 && isBreak) coin += 8000
          if (level == 60 && isBreak) coin += 15000
          return coin
        }
        this.coin += getCoin(v.target) - getCoin(v.current)

        // 铭迹
        let targetSkillStarDiff = (i, u) =>
          v.current.rank >= i &&
          v.target.rank >= i &&
          v.target.skill[i].star >= u &&
          v.current.skill[i].star < u

        for (let i = 0; i < 3; i++) {
          let currentS = 0,
            currentC = 0,
            targetS = 0,
            targetC = 0
          if (v.current.rank >= i && v.current.skill[i].star) {
            let { star, level } = v.current.skill[i]
            currentC = skillResource[star][level].coin
            currentS = skillResource[star][level].sand
          }
          if (v.target.rank >= i && v.target.skill[i].star) {
            let { star, level } = v.target.skill[i]
            targetC = skillResource[star][level].coin
            targetS = skillResource[star][level].sand
          }
          this.coin += targetC - currentC
          this.眩光沙砾 += targetS - currentS

          if (targetSkillStarDiff(i, 1)) this.稀愿珍宝 += 5
          if (targetSkillStarDiff(i, 2)) this.稀愿珍宝 += 5

          if (targetSkillStarDiff(i, 3)) this.心愿海螺 += 8
          if (targetSkillStarDiff(i, 4)) this.心愿海螺 += 10
        }
      }

      this.coin = Math.max(this.coin - this.current.coin, 0)
      this.exp = Math.max(
        this.exp - 500 * this.current.初心 - 2000 * this.current.慕心 - 5000 * this.current.恋心,
        0
      )
      this.眩光沙砾 = Math.max(this.眩光沙砾 - this.current.眩光沙砾, 0)
      this.稀愿珍宝 = Math.max(this.稀愿珍宝 - this.current.稀愿珍宝, 0)
      this.心愿海螺 = Math.max(this.心愿海螺 - this.current.心愿海螺, 0)

      let ratio = this.grandmaDouble ? 2 : 1
      this.遇见极光 = Math.ceil(this.coin / 7200)
      this.遇见初心 = Math.ceil(this.慕心 / 4)
      this.外婆小铺3 = Math.ceil(this.稀愿珍宝 / ratio)
      this.外婆小铺6 = Math.ceil((this.心愿海螺 / ratio) * 5)
      this.遇见铭迹 = Math.ceil(Math.max(this.眩光沙砾 - this.外婆小铺6 * ratio, 0) / 30)
    },
  },
}
</script>
