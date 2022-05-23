<template>
  <navbar title="道具合成" can-return />

  <van-tabs v-model:active="active" sticky offset-top="46">
    <van-tab title="设计师证明">
      <van-cell-group title="合成目标" inset>
        <van-field
          v-model="aTargetString"
          label="合成目标"
          readonly
          is-link
          @click="showPicker = true"
        />
      </van-cell-group>

      <van-cell-group title="目前持有" inset>
        <template v-for="i in [0, 1, 2, 3]" :key="i">
          <van-cell v-if="i < aTarget" :title="aName[i]" center>
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

      <van-cell-group title="需要合成" inset>
        <template v-for="i in [1, 2, 3, 4]" :key="i">
          <van-cell v-if="i <= aTarget" :title="aName[i]" :value="aNeed[i]" />
        </template>
      </van-cell-group>
    </van-tab>

    <van-tab title="工艺学习">
      <van-cell-group title="目前持有" inset>
        <van-cell v-for="i in [0, 1]" :key="i" :title="bName[i]" center>
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
        <van-cell title="清空" is-link @click="b = [0, 0]" />
      </van-cell-group>

      <van-cell-group title="需要合成" inset>
        <van-cell
          v-for="i in [1, 2]"
          :key="i"
          :title="bName[i]"
          :value="bNeed[i]"
        />
      </van-cell-group>
    </van-tab>
  </van-tabs>

  <van-popup v-model:show="showPicker" round position="bottom">
    <van-picker
      :columns="aName.slice(2)"
      :default-index="2"
      @confirm="confirmA"
      @cancel="showPicker = false"
    />
  </van-popup>
</template>

<script>
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'Item',
  components: {
    Navbar,
  },
  data() {
    return {
      active: 0,
      showPicker: false,
      a: [0, 0, 0, 0, 0],
      aName: [
        '设计助理证明',
        '初级设计师证明',
        '设计师证明',
        '资深设计师证明',
        '创意总监证明',
      ],
      aNeed: [0, 0, 0, 0, 0],
      aTarget: 4,
      aTargetString: '创意总监证明',
      b: [0, 0],
      bName: ['一级材料', '二级材料', '三级材料'],
      bNeed: [0, 0, 0],
    }
  },
  methods: {
    confirmA(v) {
      this.showPicker = false
      this.aTargetString = v
      for (let i in this.aName) if (this.aName[i] == v) this.aTarget = i
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
