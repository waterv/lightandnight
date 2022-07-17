<template>
  <navbar title="羁梦星愿模拟器" can-return />
  <van-tabs v-model:active="active" sticky offset-top="46">
    <canvas v-show="active == 0" id="canvas" :width="width" :height="width"></canvas>
    <van-tab title="羁梦星愿">
      <van-cell-group title="抽卡" inset>
        <van-cell v-if="remainGifts" title="许愿" is-link @click="gacha3Times" />
        <van-cell v-else :title="`恭喜您 ${this.gachaTime} 次许愿获得全部星辰馈赠！`" />
      </van-cell-group>

      <van-cell-group title="当前状态" inset>
        <van-cell
          title="星辰馈赠概率"
          :value="giftPossibilityString"
          is-link
          @click="possibilityShow = true"
        />
        <van-cell>
          已许愿次数
          <van-progress
            :percentage="(gachaTime / 99) * 100"
            :pivot-text="`${gachaTime}`"
            pivot-color="#6c71c5"
            :color="$root.colors.events.wish"
          /><small>/ 88 / 95 / 99 抽各有一次保底</small>
        </van-cell>
      </van-cell-group>

      <van-cell-group title="星辰馈赠" inset>
        <van-cell v-for="v in gifts" :key="v" :title="v.name">
          <template #right-icon>
            <template v-if="v.time"> （第 {{ v.time }} 抽） </template>
            <van-checkbox v-model="v.had" disabled />
          </template>
        </van-cell>
      </van-cell-group>
    </van-tab>

    <van-tab title="设置">
      <van-radio-group v-model="maxFrame">
        <van-cell-group title="动画速度" inset>
          <van-cell
            v-for="v in maxFrameData"
            :key="v"
            :title="v.text"
            clickable
            @click="setMaxFrame(v.value)"
          >
            <template #right-icon>
              <van-radio :name="v.value" />
            </template>
          </van-cell>
        </van-cell-group>
      </van-radio-group>

      <van-cell-group title="奖品权重" inset>
        <van-cell title="说明" icon="question-o" is-link @click="showWeightInfo" />
        <van-cell v-for="i in [0, 5]" :key="i" :title="rewards[i].name" center>
          <template #right-icon>
            <van-stepper v-model="rewards[i].weight" min="140" max="175" input-width="64px" />
          </template>
        </van-cell>
      </van-cell-group>
    </van-tab>
  </van-tabs>

  <van-config-provider :theme-vars="dialogTheme">
    <van-dialog v-model:show="possibilityShow" closeOnClickOverlay>
      <div class="container">
        <van-row class="content center-row">
          <van-col span="8"><strong>奖品</strong></van-col>
          <van-col span="8"><strong>当前出率</strong></van-col>
          <van-col span="8"><strong>剩余</strong></van-col>
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
        <van-row class="content">
          <van-col span="24" class="desc"
            >除了「恋心」数目无限外，其余奖励全部获得后，其概率会均摊增加到其余奖励上。</van-col
          >
        </van-row>
        <van-row class="content">
          <van-col span="24" class="desc"
            >若 3 颗球同时落入浅色区域，则可以随机获取 1 份「星辰馈赠」且不会重复。</van-col
          >
        </van-row>
      </div>
    </van-dialog>

    <van-dialog v-model:show="itemsGotShow" title="恭喜获得" closeOnClickOverlay>
      <div class="container" v-if="itemsGot">
        <div class="content" v-for="v in itemsGot" :key="v">{{ v.name }} × {{ v.count }}</div>
      </div>
    </van-dialog>
  </van-config-provider>
</template>

<script>
import { Progress, Notify } from 'vant'
import { useWindowSize } from '@vant/use'
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'Wish',
  components: {
    [Progress.name]: Progress,
    [Notify.name]: Notify,
    Navbar,
  },
  data() {
    const { width } = useWindowSize()
    return {
      active: 0,
      width: Math.min(width.value, 425),
      gachaTime: 0,
      initialAngle_: Math.PI,
      initialAngle: Math.PI,
      angles_: [Math.PI, Math.PI, Math.PI],
      angles: [Math.PI, Math.PI, Math.PI],
      frame: 0,
      maxFrame_: undefined,
      maxFrameData: [
        { text: '慢慢速', value: 216 },
        { text: '慢速', value: 144 },
        { text: '中速', value: 72 },
        { text: '快速', value: 36 },
        { text: '光速', value: 1 },
      ],
      rewards: [
        { name: '恋心', count: 2, remain: undefined, weight: 166 },
        { name: '极光币', count: 5000, remain: 38, weight: 100 },
        { name: '小熊星座', count: 100, remain: 18, weight: 100 },
        { name: '慕心', count: 3, remain: 28, weight: 100 },
        { name: '星旅币', count: 40, remain: 39, weight: 100 },
        { name: '眩光沙砾', count: 100, remain: 9, weight: 145 },
        { name: '心愿海螺', count: 1, remain: 38, weight: 100 },
        { name: '灵感结晶', count: 1, remain: 18, weight: 100 },
        { name: '镜中身影', count: 10, remain: 30, weight: 100 },
        { name: '光影留痕', count: 1, remain: 28, weight: 100 },
      ],
      gifts: [
        { name: '限定灵犀', count: 1, remain: 1, had: false },
        { name: '动态头像框', count: 1, remain: 1, had: false },
        { name: '点击特效', count: 1, remain: 1, had: false },
      ],
      itemsGot: [],
      itemsGotShow: false,
      possibilityShow: false,
      dialogTheme: {
        dialogFontSize: 'var(--van-font-size-md)',
      },
    }
  },
  computed: {
    totalWeight() {
      return this.rewards.reduce((prev, curr) => {
        if (curr.remain !== 0) return prev + curr.weight
        return prev
      }, 0)
    },
    possibilities() {
      return this.rewards.map(item => (item.remain === 0 ? 0 : item.weight / this.totalWeight))
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
        localStorage.setItem('WishSimMaxFrame', v)
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
      this.$dialog.alert({
        ...this.$root.dialogSettings,
        message:
          '由于官方未公示该活动概率具体计算规则，本工具中使用的概率数据是由面积比例估算而来，与实际情况不符。\n\n' +
          '本工具默认假设：\n' +
          '- 「恋心」占有 166 的权重；\n' +
          '- 「眩光沙砾」占有 145 的权重；\n' +
          '- 其他奖励均占有 100 的权重。\n' +
          '所得到的概率数值与已记录的实际数值稍有偏差。如果您有更好的权重数据，可在此处更改。',
      })
    },
    setMaxFrame(v) {
      this.maxFrame = v
      this.frame = 0
    },
    gacha3Times() {
      if (this.frame && this.frame <= this.maxFrame) return
      if (this.gachaTime > 99) return
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
          this.initialAngle + this.beginAngle[reward] + this.shapeAngle[reward] * Math.random()
        )
      }
      this.frame = 0
      this.angles = angles
      let animate = () => {
        this.updateCanvas()
        this.frame += 1
        if (this.frame <= this.maxFrame) requestAnimationFrame(animate)
        else {
          if (isGift) Notify({ type: 'success', message: '恭喜获得星辰馈赠！' })
          if (!isGift && this.remainGifts == 3 && this.gachaTime == 88) {
            isGift = true
            Notify({
              type: 'success',
              message: '您已经许愿 88 次，获得星辰馈赠！',
            })
          } else if (!isGift && this.remainGifts == 2 && this.gachaTime == 95) {
            isGift = true
            Notify({
              type: 'success',
              message: '您已经许愿 95 次，获得星辰馈赠！',
            })
          } else if (!isGift && this.remainGifts == 1 && this.gachaTime == 99) {
            isGift = true
            Notify({
              type: 'success',
              message: '您已经许愿 99 次，获得星辰馈赠！',
            })
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
      for (let i in this.rewards) {
        let item = this.rewards[i]
        if (item.remain === 0) continue
        if (random <= this.possibilities[i]) {
          if (item.remain) item.remain -= 1
          return i
        }
        random -= this.possibilities[i]
      }
    },
    updateCanvas() {
      let width = this.width
      let canvas = document.getElementById('canvas')
      let ctx = canvas.getContext('2d')

      let easeInOut = (t, b, c, d) => {
        if ((t /= d / 2) < 1) return (c / 2) * t * t + b
        return (-c / 2) * (--t * (t - 2) - 1) + b
      } // 网上搜的

      let centerX = width * 0.5
      let centerY = width * 0.5
      let radius = width * 0.3
      let textRadius = width * 0.375
      let ballRadius = width * 0.015
      let ballPositionRadius = [width * 0.1, width * 0.17, width * 0.24]

      let initialAngle = easeInOut(
        this.frame,
        this.initialAngle_,
        this.initialAngle - this.initialAngle_ + 10 * Math.PI,
        this.maxFrame
      )

      let angles = this.angles.map((angle, i) =>
        easeInOut(
          this.frame,
          this.angles_[i],
          angle - this.angles_[i] - (6 + 4 * i) * Math.PI,
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
          textRadius * Math.cos(initialAngle + this.beginAngle[i] + this.shapeAngle[i] / 2)
        let y =
          centerY +
          textRadius * Math.sin(initialAngle + this.beginAngle[i] + this.shapeAngle[i] / 2)
        ctx.fillText(this.rewards[i].name, x, y)
        if (this.rewards[i].remain)
          ctx.fillText(`× ${this.rewards[i].count} × ${this.rewards[i].remain}`, x, y + 12)
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
        ctx.fillText(`恭喜您 ${this.gachaTime} 次许愿获得全部星辰馈赠！`, centerX, centerY)
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
