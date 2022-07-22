<template>
  <navbar
    :title="$t('route.level')"
    can-return
    @click-right="removeCard(active - 1)"
  >
    <van-icon v-if="card.length > 1 && active" name="delete-o" color="red" />
  </navbar>

  <van-tabs v-model:active="active" sticky offset-top="46">
    <van-tab :title="$t('common.calculate')">
      <van-cell-group inset :title="$t('common.currentStatus')">
        <van-field
          :left-icon="require('@/assets/items/coin.png')"
          :label="$t('items.coin')"
          v-model="current.coin"
          type="number"
          autocomplete="off"
        />
        <van-field
          :left-icon="require('@/assets/items/120001.png')"
          :label="$t('items.120001')"
          v-model="current.初心"
          type="number"
          autocomplete="off"
        />
        <van-field
          :left-icon="require('@/assets/items/120002.png')"
          :label="$t('items.120002')"
          v-model="current.慕心"
          type="number"
          autocomplete="off"
        />
        <van-field
          :left-icon="require('@/assets/items/120003.png')"
          :label="$t('items.120003')"
          v-model="current.恋心"
          type="number"
          autocomplete="off"
        />
        <van-field
          :left-icon="require('@/assets/items/230001.png')"
          :label="$t('items.230001')"
          v-model="current.眩光沙砾"
          type="number"
          autocomplete="off"
        />
        <van-field
          :left-icon="require('@/assets/items/231001.png')"
          :label="$t('items.231001')"
          v-model="current.稀愿珍宝"
          type="number"
          autocomplete="off"
        />
        <van-field
          :left-icon="require('@/assets/items/231002.png')"
          :label="$t('items.231002')"
          v-model="current.心愿海螺"
          type="number"
          autocomplete="off"
        />
        <van-cell :title="$t('level.double')">
          <template #right-icon>
            <van-switch v-model="grandmaDouble" size="24" />
          </template>
        </van-cell>
      </van-cell-group>

      <van-cell-group title=" " inset>
        <van-cell :title="$t('level.add')" @click="addCard" center is-link />
        <van-cell
          :title="$t('common.calculate')"
          @click="calculate"
          center
          is-link
        />
      </van-cell-group>

      <van-cell-group :title="$t('level.need')" inset>
        <van-cell
          :icon="require('@/assets/items/coin.png')"
          :title="$t('items.coin')"
          :value="coin"
        />
        <van-cell
          :icon="require('@/assets/items/120001.png')"
          :title="$t('level.exp')"
          :value="exp"
        />
        <van-cell
          :icon="require('@/assets/items/120002.png')"
          :title="$t('common.equalsTo', [$t('items.120002')])"
          :value="慕心"
        />
        <van-cell
          :icon="require('@/assets/items/230001.png')"
          :title="$t('items.230001')"
          :value="眩光沙砾"
        />
        <van-cell
          :icon="require('@/assets/items/231001.png')"
          :title="$t('items.231001')"
          :value="稀愿珍宝"
        />
        <van-cell
          :icon="require('@/assets/items/231002.png')"
          :title="$t('items.231002')"
          :value="心愿海螺"
        />
      </van-cell-group>

      <van-cell-group :title="$t('level.plan')" inset>
        <van-cell title="" :label="$t('level.planDesc')" />
        <van-cell
          :title="$t('level.遇见极光_5')"
          :label="$t('level.equal', [10, 7200, $t('items.coin')])"
          :value="遇见极光"
          center
        />
        <van-cell
          :title="$t('level.遇见初心_5')"
          :label="$t('level.equal', [10, 4, $t('items.120002')])"
          :value="遇见初心"
          center
        />
        <van-cell
          :title="$t('level.遇见初心_5')"
          :label="$t('level.equal', [10, 30, $t('items.230001')])"
          :value="遇见铭迹"
          center
        />
        <van-cell
          :title="$t('level.外婆小铺_3_7')"
          :label="$t('level.sim', [7, grandmaDouble + 1, $t('items.231001')])"
          :value="外婆小铺3"
          center
        />
        <van-cell
          :title="$t('level.外婆小铺_6_7')"
          :label="
            $t('level.sim2', [
              40,
              grandmaDouble + 1,
              $t('items.231002'),
              (grandmaDouble + 1) * 5,
              $t('items.230001'),
            ])
          "
          :value="外婆小铺6"
          center
        />
        <van-cell
          :icon="require('@/assets/items/flower.png')"
          :title="$t('items.flower')"
          :value="灵感"
        />
      </van-cell-group>
    </van-tab>
    <template v-for="(v, i) in card" :key="v">
      <van-tab :title="v.name || $t('level.card', [i + 1])">
        <van-cell-group title=" " inset>
          <van-field
            v-model="v.name"
            :label="$t('common.name')"
            :placeholder="$t('level.card', [i + 1])"
            autocomplete="off"
          />
        </van-cell-group>
        <van-cell-group :title="$t('common.currentStatus')" inset>
          <van-cell :title="$t('level.star')" center>
            <template #right-icon>
              <van-stepper
                v-model="v.current.star"
                v-bind="stepper"
                min="1"
                max="6"
                @change="v.target.star = v.current.star"
              />
            </template>
          </van-cell>
          <van-cell :title="$t('level.rank')" center>
            <template #right-icon>
              <van-stepper
                v-model="v.current.rank"
                v-bind="stepper"
                min="0"
                max="5"
              />
            </template>
          </van-cell>
          <van-cell :title="$t('level.level')" center>
            <template #right-icon>
              <van-stepper
                v-model="v.current.level"
                v-bind="stepper"
                min="1"
                :max="maxLevel(v.current.star)"
              />
            </template>
          </van-cell>
          <template v-if="isBreakAvailable(v.current)">
            <van-cell :title="$t('level.break')" icon="arrow">
              <template #right-icon>
                <van-switch v-model="v.current.isBreak" size="24" />
              </template>
            </van-cell>
          </template>
          <template v-for="i in [0, 1, 2]" :key="i">
            <template v-if="v.current.rank >= i">
              <van-cell :title="$t('level.skill', [i + 1])" />
              <van-cell :title="$t('level.star')" icon="arrow" center>
                <template #right-icon>
                  <van-stepper
                    v-model="v.current.skill[i].star"
                    v-bind="stepper"
                    min="0"
                    max="4"
                  />
                </template>
              </van-cell>
              <template v-if="v.current.skill[i].star">
                <van-cell :title="$t('level.level')" icon="arrow" center>
                  <template #right-icon>
                    <van-stepper
                      v-model="v.current.skill[i].level"
                      v-bind="stepper"
                      min="1"
                      :max="maxSkillLevel(v.current.skill[i].star)"
                    />
                  </template>
                </van-cell>
              </template>
            </template>
          </template>
        </van-cell-group>

        <van-cell-group :title="$t('level.target')" inset>
          <van-cell v-if="v.current.star > 3" :title="$t('level.star')" center>
            <template #right-icon>
              <van-stepper
                v-model="v.target.star"
                v-bind="stepper"
                :min="v.current.star"
                max="6"
              />
            </template>
          </van-cell>
          <van-cell :title="$t('level.rank')" center>
            <template #right-icon>
              <van-stepper
                v-model="v.target.rank"
                v-bind="stepper"
                :min="v.current.rank"
                max="5"
              />
            </template>
          </van-cell>
          <van-cell :title="$t('level.level')" center>
            <template #right-icon>
              <van-stepper
                v-model="v.target.level"
                v-bind="stepper"
                :min="v.current.level"
                :max="maxLevel(v.target.star)"
              />
            </template>
          </van-cell>
          <template v-if="isBreakAvailable(v.target)">
            <van-cell :title="$t('level.break')" icon="arrow">
              <template #right-icon>
                <van-switch v-model="v.target.isBreak" size="24" />
              </template>
            </van-cell>
          </template>
          <van-cell v-if="v.current.star >= 5" :title="$t('level.second')">
            <template #right-icon>
              <van-switch v-model="v.target.second" size="24" />
            </template>
          </van-cell>
          <template v-for="i in [0, 1, 2]" :key="i">
            <template v-if="v.target.rank >= i">
              <van-cell :title="$t('level.skill', [i + 1])" />
              <van-cell :title="$t('level.star')" icon="arrow" center>
                <template #right-icon>
                  <van-stepper
                    v-model="v.target.skill[i].star"
                    v-bind="stepper"
                    :min="v.current.skill[i].star"
                    max="4"
                  />
                </template>
              </van-cell>
              <template v-if="v.target.skill[i].star">
                <van-cell :title="$t('level.level')" icon="arrow" center>
                  <template #right-icon>
                    <van-stepper
                      v-model="v.target.skill[i].level"
                      v-bind="stepper"
                      :min="
                        v.current.skill[i].star < v.target.skill[i].star
                          ? 1
                          : v.current.skill[i].level
                      "
                      :max="maxSkillLevel(v.target.skill[i].star)"
                    />
                  </template>
                </van-cell>
              </template>
            </template>
          </template>
        </van-cell-group>
      </van-tab>
    </template>
  </van-tabs>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
let levelResource = require('@/data/levelResource.json')
let skillResource = require('@/data/skillResource.json')
let levelInitial = require('@/data/levelInitial.json')

export default {
  name: 'LevelCalculator',
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
      stepper: {
        integer: true,
        'input-width': '48px',
      },
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
      this.card.push({
        ...JSON.parse(JSON.stringify(levelInitial)),
        name: this.$t('level.card', [this.card.length + 1]),
      })
    },
    removeCard(i) {
      if (this.card.length > 1 && this.active) {
        this.card.splice(i, 1)
        this.active = 0
      }
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
        this.exp -
          500 * this.current.初心 -
          2000 * this.current.慕心 -
          5000 * this.current.恋心,
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
      this.遇见铭迹 = Math.ceil(
        Math.max(this.眩光沙砾 - this.外婆小铺6 * ratio, 0) / 30
      )
    },
  },
}
</script>
