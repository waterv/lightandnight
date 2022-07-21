<template>
  <navbar :title="$t('route.item')" can-return />

  <van-tabs v-model:active="active" sticky offset-top="46">
    <van-tab :title="$t('item.a')">
      <van-cell-group :title="$t('item.target')" inset>
        <van-field
          v-model="aTargetString"
          :label="$t('item.target')"
          readonly
          is-link
          @click="showPicker = true"
        />
      </van-cell-group>

      <van-cell-group :title="$t('common.currentStatus')" inset>
        <template v-for="i in [0, 1, 2, 3]" :key="i">
          <van-cell
            v-if="i < aTarget"
            :title="aName[i]"
            :icon="require(`@/assets/img/items/${aId[i]}.png`)"
            center
          >
            <template #right-icon>
              <van-stepper
                v-model="a[i]"
                integer
                min="0"
                input-width="64px"
                @change="calculateA"
              />
            </template>
          </van-cell>
        </template>
      </van-cell-group>

      <van-cell-group :title="$t('item.path')" inset>
        <template v-for="i in [1, 2, 3, 4]" :key="i">
          <van-cell
            v-if="i <= aTarget"
            :title="aName[i]"
            :icon="require(`@/assets/img/items/${aId[i]}.png`)"
            :value="aNeed[i]"
          />
        </template>
      </van-cell-group>
    </van-tab>

    <van-tab :title="$t('item.b')">
      <van-cell-group :title="$t('common.currentStatus')" inset>
        <van-cell
          v-for="i in [0, 1]"
          :key="i"
          :title="bName[i]"
          :icon="require(`@/assets/img/items/${bId[i]}.png`)"
          center
        >
          <template #right-icon>
            <van-stepper
              v-model="b[i]"
              integer
              min="0"
              input-width="64px"
              @change="calculateB"
            />
          </template>
        </van-cell>
        <van-cell :title="$t('common.clear')" is-link @click="b = [0, 0]" />
      </van-cell-group>

      <van-cell-group :title="$t('item.path')" inset>
        <van-cell
          v-for="i in [1, 2]"
          :key="i"
          :title="bName[i]"
          :icon="require(`@/assets/img/items/${bId[i]}.png`)"
          :value="bNeed[i]"
        />
      </van-cell-group>
    </van-tab>
  </van-tabs>

  <van-popup
    v-model:show="showPicker"
    round
    position="bottom"
    safe-area-inset-bottom
  >
    <van-picker
      :columns="aColumns"
      :default-index="2"
      @confirm="confirmA"
      @cancel="showPicker = false"
    />
  </van-popup>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'ItemCalculator',
  components: {
    Navbar,
  },
  data() {
    let aId = [200102, 200103, 200104, 200105, 200106]
    let aName = aId.map(v => this.$t(`items.${v}`))
    let bId = [200011, 200012, 200013]
    let bName = bId.map(v => this.$t(`items.${v}`))
    return {
      active: 0,
      showPicker: false,
      a: [0, 0, 0, 0, 0],
      aName,
      aId,
      aNeed: [0, 0, 0, 0, 0],
      aTarget: 4,
      aTargetString: aName[4], // 4 is aTarget
      b: [0, 0],
      bName,
      bId,
      bNeed: [0, 0, 0],
    }
  },
  computed: {
    aColumns() {
      return this.aName.slice(2).map((v, i) => {
        return { text: v, value: i + 2 }
      })
    },
  },
  methods: {
    confirmA(v) {
      this.showPicker = false
      this.aTargetString = v.selectedOptions[0].text
      this.aTarget = v.selectedOptions[0].value
      this.calculateA()
    },
    calculateA() {
      this.aNeed = [0, 0, 0, 0, 0]
      let maxB = a => Math.floor(a / 2)
      let maxC = (a, b) =>
        Math.min(Math.floor((a + 2 * b) / 8), Math.floor(a / 2))
      let maxD = (a, b, c) => {
        if (Math.floor((b + maxB(a)) / 2) < Math.floor(c / 3))
          return Math.floor((b + maxB(a)) / 2)
        else if (
          Math.floor((c + maxC(a, b)) / 3) <
          Math.floor((b - 3 * maxC(a, b)) / 2)
        )
          return Math.floor((c + maxC(a, b)) / 3)
        else return Math.floor((8 * c + 2 * b + a) / 28)
      }
      let maxE = (a, b, c, d) => {
        if (Math.floor((c + maxC(a, b)) / 2) < Math.floor(d / 3))
          return Math.floor((c + maxC(a, b)) / 2)
        else if (
          Math.floor((d + maxD(a, b, c)) / 3) <
          Math.floor((c - 3 * maxC(a, b, c)) / 2)
        )
          return Math.floor((d + maxD(a, b, c)) / 3)
        else return Math.round((a + 2 * b + 8 * c + 28 * d) / 100) // 摆烂了
      }
      let a = Number(this.a[0])
      let b = Number(this.a[1])
      let c = Number(this.a[2])
      let d = Number(this.a[3])
      if (this.aTarget == 2) {
        let C = maxC(a, b)
        let B = Math.max(3 * C - b, 0)
        this.aNeed = [0, B, C, 0, 0]
      }
      if (this.aTarget == 3) {
        let D = maxD(a, b, c)
        let C = Math.max(3 * D - c, 0)
        let B = Math.max(2 * D - b, 0)
        this.aNeed = [0, B, C, D, 0]
      }
      if (this.aTarget == 4) {
        let flag = true
        let E = maxE(a, b, c, d),
          D,
          C,
          B
        while (flag) {
          if (3 * E > d + maxD(a, b, c)) {
            E -= 1
            continue
          }
          D = Math.max(3 * E - d, 0)
          if (3 * D + 2 * E > c + maxC(a, b)) {
            E -= 1
            continue
          }
          C = Math.max(3 * D + 2 * E - c, 0)
          if (3 * C + 2 * D > b + maxB(a)) {
            E -= 1
            continue
          }
          B = Math.max(3 * C + 2 * D - b, 0)
          if (2 * B + 2 * C > a) {
            E -= 1
            continue
          }
          flag = false
        }
        this.aNeed = [0, B, C, D, E]
      }
    },
    calculateB() {
      let a = Number(this.b[0])
      let b = Number(this.b[1])
      let C = Math.min(Math.floor(a / 3), Math.floor((a + 3 * b) / 12))
      let B = Math.max(3 * C - b, 0)
      this.bNeed = [0, B, C]
    },
  },
}
</script>
