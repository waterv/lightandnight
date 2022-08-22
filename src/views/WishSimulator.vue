<template>
  <navbar
    :title="$t('route.wishsim')"
    can-return
    @click-right="volumesShow = true"
  >
    <van-icon name="exchange" />
  </navbar>

  <van-tabs v-model:active="active" sticky offset-top="46">
    <canvas v-show="active == 0" id="canvas" :width="width" :height="width">
    </canvas>
    <van-tab :title="data[volume].name">
      <van-cell-group :title="$t('common.gacha')" inset>
        <van-cell
          v-if="remainGifts"
          :title="$t('wishsim.gacha')"
          is-link
          @click="gacha3Times"
        />
        <van-cell
          v-else
          :title="$t('wishsim.complete', [gachaTime, data[volume].gift])"
        />
      </van-cell-group>

      <van-cell-group :title="$t('common.currentStatus')" inset>
        <van-cell
          :title="$t('wishsim.possibility', [data[volume].gift])"
          :value="giftPossibilityString"
          is-link
          @click="possibilityShow = true"
        />
        <van-cell>
          {{ $t('wishsim.gachaTime') }}
          <van-progress
            :percentage="(gachaTime / data[volume].must[2]) * 100"
            :pivot-text="`${gachaTime}`"
            pivot-color="#6c71c5"
            color="linear-gradient(135deg, #6c71c5, #93a9da)"
          />
          <small v-text="$t('wishsim.gachaTimeDesc', data[volume].must)" />
        </van-cell>
      </van-cell-group>

      <van-cell-group :title="data[volume].gift" inset>
        <van-cell v-for="v in gifts" :key="v" :title="v.name">
          <template #right-icon>
            <template v-if="v.time">
              {{ $t('wishsim.giftTime', [v.time]) }}
            </template>
            <van-checkbox v-model="v.had" disabled />
          </template>
        </van-cell>
      </van-cell-group>
    </van-tab>

    <van-tab :title="$t('common.settings')">
      <van-radio-group v-model="maxFrame">
        <van-cell-group :title="$t('wishsim.settings.maxFrame')" inset>
          <van-cell
            v-for="v in maxFrames"
            :key="v"
            :title="$t(`wishsim.settings.maxFrames[${v}]`)"
            clickable
            @click="setMaxFrame(v)"
          >
            <template #right-icon>
              <van-radio :name="v" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>

      <van-cell-group
        v-if="volume === 0"
        :title="$t('wishsim.settings.weight')"
        inset
      >
        <van-cell
          :title="$t('common.info')"
          icon="question-o"
          is-link
          @click="showWeightInfo"
        />
        <van-cell v-for="i in [0, 5]" :key="i" :title="rewards[i].name" center>
          <template #right-icon>
            <van-stepper
              v-model="rewards[i].weight"
              min="140"
              max="175"
              input-width="48px"
            />
          </template>
        </van-cell>
      </van-cell-group>
    </van-tab>
  </van-tabs>

  <van-config-provider :theme-vars="dialogTheme">
    <van-dialog v-model:show="possibilityShow" closeOnClickOverlay>
      <div class="container">
        <van-row class="content center-row">
          <van-col v-for="i in [0, 1, 2]" :key="i" span="8">
            <strong v-t="`wishsim.possibilityTitle[${i}]`" />
          </van-col>
        </van-row>
        <van-divider dashed />
        <van-row v-for="(v, i) in rewards" :key="v" class="content center-row">
          <van-col span="8">{{ v.name }}</van-col>
          <van-col span="8">{{ possibilitiesString[i] }}</van-col>
          <van-col span="8">{{ v.remain }}</van-col>
        </van-row>
      </div>
      <van-divider />
      <div class="container">
        <van-row v-for="i in [0, 1]" :key="i" class="content">
          <van-col span="24" class="desc">
            {{ $t(`wishsim.possibilityDesc[${i}]`, [data[volume].gift]) }}
          </van-col>
        </van-row>
      </div>
    </van-dialog>

    <van-dialog
      v-model:show="itemsGotShow"
      :title="$t('wishsim.resultTitle')"
      closeOnClickOverlay
    >
      <div class="container" v-if="itemsGot">
        <div class="content" v-for="v in itemsGot" :key="v">
          {{ $t('wishsim.giftNumber', [v.name, v.count]) }}
        </div>
      </div>
    </van-dialog>
  </van-config-provider>

  <van-action-sheet
    v-model:show="volumesShow"
    :actions="volumes"
    :cancel-text="$t('common.back')"
    close-on-click-action
    @select="selectVolume"
  />
</template>

<script>
import { showDialog, showNotify, ActionSheet, Progress } from 'vant'
import { useWindowSize } from '@vant/use'
import Navbar from '@/components/Navbar.vue'
let data = require('@/data/CN/wish.json')

let preset = {
  gachaTime: 0,
  initialAngle_: Math.PI,
  initialAngle: Math.PI,
  angles_: [Math.PI, Math.PI, Math.PI],
  angles: [Math.PI, Math.PI, Math.PI],
  frame: 0,
  maxFrame_: undefined,
  gifts: [0, 1, 2].map(i => ({
    name: data[data.length - 1].gifts[i],
    count: 1,
    remain: 1,
    had: false,
  })),
  itemsGot: [],
}

let easeInOut = (t, b, c, d) => {
  if ((t /= d / 2) < 1) return (c / 2) * t * t + b
  return (-c / 2) * (--t * (t - 2) - 1) + b
} // 网上搜的

export default {
  name: 'WishSimulator',
  components: {
    [ActionSheet.name]: ActionSheet,
    [Progress.name]: Progress,
    Navbar,
  },
  data() {
    const { width } = useWindowSize()
    return {
      ...preset,
      data,
      rewards: data[data.length - 1].rewards.map(v => ({
        ...v,
        name: this.$t(`items.${v.id}`),
      })),
      active: 0,
      volume: data.length - 1,
      volumes: data.map((v, i) => ({ name: v.name, index: i })),
      width: Math.min(width.value, 425),
      maxFrames: [216, 144, 72, 36, 1],
      volumesShow: false,
      itemsGotShow: false,
      possibilityShow: false,
      dialogTheme: {
        dialogFontSize: 'var(--van-font-size-md)',
      },
    }
  },
  watch: {
    volume(v) {
      Object.assign(this, {
        ...preset,
        gifts: [0, 1, 2].map(i => ({
          name: data[v].gifts[i],
          count: 1,
          remain: 1,
          had: false,
        })),
        rewards: data[v].rewards.map(v => ({
          ...v,
          name: this.$t(`items.${v.id}`),
        })),
      })
      this.updateCanvas()
    },
  },
  computed: {
    totalWeight() {
      return this.rewards.reduce((prev, curr) => {
        if (curr.remain !== 0) return prev + curr.weight
        return prev
      }, 0)
    },
    possibilities() {
      return this.rewards.map(item =>
        item.remain === 0 ? 0 : item.weight / this.totalWeight
      )
    },
    possibilitiesString() {
      return this.possibilities.map(p => Math.round(p * 10000) / 100 + '%')
    },
    giftPossibilityString() {
      return Math.round(Math.pow(this.possibilities[0], 3) * 10000) / 100 + '%'
    },
    remainGifts() {
      return this.gifts.reduce((prev, curr) => prev + curr.remain, 0)
    },
    shapeAngle() {
      return this.possibilities.map(p => 2 * Math.PI * p)
    },
    beginAngle() {
      let result = [0]
      for (let i in this.shapeAngle) result.push(result[i] + this.shapeAngle[i])
      return result
    },
    maxFrame: {
      get() {
        if (this.maxFrame_ === undefined) {
          let data = localStorage?.getItem('WishSimMaxFrame')
          return data !== null ? Number(data) : 144
        }
        return this.maxFrame_
      },
      set(v) {
        this.maxFrame_ = v
        localStorage?.setItem('WishSimMaxFrame', v)
      },
    },
  },
  mounted() {
    let canvas = document.getElementById('canvas')
    let ctx = canvas.getContext('2d')

    let getPixelRatio = context => {
      let backingStore =
        context.backingStorePixelRatio ||
        context.webkitBackingStorePixelRatio ||
        context.mozBackingStorePixelRatio ||
        context.msBackingStorePixelRatio ||
        context.oBackingStorePixelRatio ||
        context.backingStorePixelRatio ||
        1
      return (window.devicePixelRatio || 1) / backingStore
    } // 网上搜的

    let ratio = getPixelRatio(ctx)
    canvas.style.width = canvas.width + 'px'
    canvas.style.height = canvas.height + 'px'
    canvas.width = canvas.width * ratio
    canvas.height = canvas.height * ratio
    ctx.scale(ratio, ratio)

    this.updateCanvas(this.angles_)
  },
  methods: {
    showWeightInfo() {
      showDialog({
        ...this.$root.dialogSettings,
        message: this.$t('hint.wishsim'),
      })
    },
    selectVolume(v) {
      this.volume = v.index
    },
    setMaxFrame(v) {
      this.maxFrame = v
      this.frame = 0
    },
    gacha3Times() {
      if (this.frame && this.frame <= this.maxFrame) return
      if (this.gachaTime > data[this.volume].must[2]) return
      if (this.remainGifts == 0) return
      this.gachaTime += 1
      this.initialAngle_ = this.initialAngle
      this.angles_ = this.angles
      this.initialAngle = 2 * Math.PI * Math.random()
      let result = {}
      let angles = []
      let isGift = true
      for (let i = 0; i < 3; i++) {
        let reward = this.gacha1Time()
        if (reward != 0) isGift = false
        if (!result[reward]) result[reward] = { ...this.rewards[reward] }
        else result[reward].count += this.rewards[reward].count
        angles.push(
          this.initialAngle +
            this.beginAngle[reward] +
            this.shapeAngle[reward] * Math.random()
        )
      }
      this.frame = 0
      this.angles = angles
      let animate = () => {
        this.updateCanvas()
        this.frame += 1
        if (this.frame <= this.maxFrame) requestAnimationFrame(animate)
        else {
          if (isGift)
            showNotify({
              type: 'success',
              message: this.$t('wishsim.notify.success', [
                data[this.volume].gift,
              ]),
            })
          if (!isGift) {
            for (let i of [0, 1, 2]) {
              if (
                this.remainGifts == 3 - i &&
                this.gachaTime == data[this.volume].must[i]
              ) {
                isGift = true
                showNotify({
                  type: 'success',
                  message: this.$t('wishsim.notify.protect', [
                    data[this.volume].must[i],
                    data[this.volume].gift,
                  ]),
                })
                break
              }
            }
          }

          if (isGift) {
            let random = Math.random()
            for (let i in this.gifts) {
              let item = this.gifts[i]
              if (item.remain == 0) continue
              if (random <= 1 / this.remainGifts) {
                item.remain -= 1
                item.had = true
                item.time = this.gachaTime
                result['gift'] = item
                break
              }
              random -= 1 / this.remainGifts
              this.updateCanvas()
            }
          }
          this.itemsGot = result
          this.itemsGotShow = true
        }
      }
      animate()
      return result
    },
    gacha1Time() {
      let random = Math.random()
      for (let [index, item] of this.rewards.entries()) {
        if (item.remain === 0) continue
        if (random <= this.possibilities[index]) {
          if (item.remain > 0) item.remain -= 1
          return index
        }
        random -= this.possibilities[index]
      }
    },
    updateCanvas() {
      let width = this.width
      let canvas = document.getElementById('canvas')
      let ctx = canvas.getContext('2d')

      let centerX = width * 0.5
      let centerY = width * 0.5
      let radius = width * 0.3
      let textRadius = width * 0.375
      let ballRadius = width * 0.015
      let ballPositionRadius = [width * 0.1, width * 0.17, width * 0.24]

      let initialAngle = easeInOut(
        this.frame,
        this.initialAngle_,
        this.initialAngle - this.initialAngle_ - 10 * Math.PI,
        this.maxFrame
      )

      let angles = this.angles.map((angle, i) =>
        easeInOut(
          this.frame,
          this.angles_[i],
          angle - this.angles_[i] + (6 + 4 * i) * Math.PI,
          this.maxFrame
        )
      )

      ctx.clearRect(0, 0, width, width)
      ctx.textAlign = 'center'

      for (let i in this.rewards) {
        if (this.rewards[i].remain === 0) continue
        ctx.beginPath()
        ctx.moveTo(centerX, centerY)
        ctx.arc(
          centerX,
          centerY,
          radius,
          initialAngle + this.beginAngle[i],
          initialAngle + this.beginAngle[i] + this.shapeAngle[i]
        )
        ctx.closePath()
        if (i == 0) ctx.fillStyle = '#525997'
        else ctx.fillStyle = '#2a2c42'
        ctx.strokeStyle = '#b9bcc2'
        ctx.setLineDash([1, 10])
        ctx.fill()
        ctx.stroke()

        let x =
          centerX +
          textRadius *
            Math.cos(initialAngle + this.beginAngle[i] + this.shapeAngle[i] / 2)
        let y =
          centerY +
          textRadius *
            Math.sin(initialAngle + this.beginAngle[i] + this.shapeAngle[i] / 2)
        ctx.fillText(this.rewards[i].name, x, y)
        if (this.rewards[i].remain)
          ctx.fillText(
            `× ${this.rewards[i].count} × ${this.rewards[i].remain}`,
            x,
            y + 12
          )
        else ctx.fillText(`× ${this.rewards[i].count} × ∞`, x, y + 12)
      }

      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        if (i == 1) ctx.setLineDash([10, 10])
        else ctx.setLineDash([])
        ctx.arc(centerX, centerY, ballPositionRadius[i], 0, 2 * Math.PI)
        ctx.closePath()
        ctx.stroke()
      }

      ctx.strokeStyle = '#fff'
      ctx.fillStyle = '#e5ce9c'
      for (let i in angles) {
        ctx.beginPath()
        let x = centerX + ballPositionRadius[i] * Math.cos(angles[i])
        let y = centerY + ballPositionRadius[i] * Math.sin(angles[i])
        ctx.arc(x, y, ballRadius, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
      }

      if (this.remainGifts == 0) {
        ctx.fillStyle = '#fff'
        ctx.fillText(
          this.$t('wishsim.complete', [this.gachaTime, data[this.volume].gift]),
          centerX,
          centerY
        )
      }
    },
  },
}
</script>

<style scoped>
#canvas {
  background-color: #fff;
}

.van-theme-dark #canvas {
  filter: brightness(0.8);
}

.center-row .van-col {
  text-align: center;
}
</style>
