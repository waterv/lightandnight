<template>
  <navbar title="晒欧模拟器" no-fix can-return />

  <van-cell-group title="说明" inset>
    <van-cell
      title="说明"
      label="建议您使用安装有「方正风雅宋」（FZYaSong-M-GBK）字体的电脑访问本页。"
    />
  </van-cell-group>

  <van-cell-group title="灵犀信息" inset>
    <van-cell title="New" center>
      <template #right-icon>
        <van-switch v-model="isNew" size="24" />
      </template>
    </van-cell>
    <van-field
      v-model="signSelected"
      is-link
      readonly
      label="签名"
      placeholder="选择签名"
      @click="showSignPicker = true"
    />
    <van-field v-model="character" label="角色" autocomplete="off" />
    <van-field v-model="name" label="灵犀名" autocomplete="off" />
    <van-cell title="星级" center>
      <template #right-icon>
        <van-stepper
          v-model="star"
          integer
          min="1"
          max="8"
          input-width="64px"
        />
      </template>
    </van-cell>
    <van-cell title="二段光影" center>
      <template #right-icon>
        <van-switch v-model="isSecond" size="24" />
      </template>
    </van-cell>
    <van-cell title="勿忘" center>
      <template #right-icon>
        <van-switch v-model="isFlower" size="24" />
      </template>
    </van-cell>
    <template v-if="isFlower">
      <van-cell title="勿忘星级" center>
        <template #right-icon>
          <van-stepper
            v-model="flower"
            integer
            min="3"
            max="6"
            input-width="64px"
          />
        </template>
      </van-cell>
      <van-cell title="勿忘边框星级" center>
        <template #right-icon>
          <van-stepper
            v-model="border"
            integer
            min="3"
            max="6"
            input-width="64px"
          />
        </template>
      </van-cell>
      <van-field v-model="flowerText" label="勿忘数量" autocomplete="off" />
    </template>
  </van-cell-group>

  <van-cell-group title="卡面" inset>
    <van-cell
      label="请将卡面手动裁剪为 宽:高=2:3 的比例，并依次将一段光影、二段光影（如果有）上传在此处。"
    >
      <template #title>
        <van-uploader v-model="card" multiple :max-count="2" />
      </template>
    </van-cell>
    <van-cell
      label="请将卡面手动裁剪为 宽:高=1:1 的比例，并上传在此处，作为「勿忘」左下角的缩略图。"
    >
      <template #title>
        <van-uploader v-model="cardThumb" multiple :max-count="1" />
      </template>
    </van-cell>
  </van-cell-group>

  <van-cell-group title="生成图片" inset>
    <van-cell
      title="生成图片"
      label="请您手动截图并裁剪为合适的尺寸，然后拿去「晒欧」吧！"
      center
      is-link
      @click="draw"
    />
  </van-cell-group>

  <van-divider />

  <canvas id="canvas" :width="width" :height="2 * width" />

  <van-popup v-model:show="showSignPicker" round position="bottom">
    <van-picker :columns="signColumn" @confirm="onSignConfirm" />
  </van-popup>
</template>

<script>
import { useWindowSize } from '@vant/use'
import { Uploader } from 'vant'
import Navbar from '@/components/Navbar.vue'

export default {
  name: 'Image',
  components: {
    [Uploader.name]: Uploader,
    Navbar,
  },
  data() {
    let { width } = useWindowSize()
    return {
      showSignPicker: false,
      signSelected: 'Bluebird',
      signColumn: [
        { text: 'Osborn', value: 0, character: '萧逸' },
        { text: 'Evan', value: 1, character: '陆沉' },
        { text: 'Sariel', value: 2, character: '齐司礼' },
        { text: 'Jesse', value: 3, character: '夏鸣星' },
        { text: 'Charlie', value: 4, character: '查理苏' },
        { text: 'Bluebird', value: 5, character: '蓝星' },
      ],
      isNew: true,
      character: '蓝星',
      name: '信使巡游',
      sign: 5,
      star: 6,
      isSecond: true,
      isFlower: false,
      flower: 6,
      border: 6,
      flowerText: '+1',
      card: [],
      cardThumb: [],
      width: Math.min(width.value, 425),
    }
  },
  mounted() {
    let canvas = document.getElementById('canvas')
    let ctx = canvas.getContext('2d')

    let ratio = this.width / 512
    canvas.style.width = 512
    canvas.style.height = 1024
    ctx.scale(ratio, ratio)
    this.draw()
  },
  methods: {
    onSignConfirm({ selectedOptions }) {
      this.showSignPicker = false
      this.sign = selectedOptions[0].value
      this.signSelected = selectedOptions[0].text
      this.character = selectedOptions[0].character
    },
    blur() {
      // Via GitHub arahaya/ImageFilters.js
      var blur = (src, dst, width, height, radius) => {
        var tableSize = radius * 2 + 1
        var radiusPlus1 = radius + 1
        var widthMinus1 = width - 1

        var r, g, b, a

        var srcIndex = 0
        var dstIndex
        var p, next, prev
        var i, l, x, y, nextIndex, prevIndex

        var sumTable = []
        for (i = 0, l = 256 * tableSize; i < l; i += 1) {
          sumTable[i] = (i / tableSize) | 0
        }

        for (y = 0; y < height; y += 1) {
          r = g = b = a = 0
          dstIndex = y

          p = srcIndex << 2
          r += radiusPlus1 * src[p]
          g += radiusPlus1 * src[p + 1]
          b += radiusPlus1 * src[p + 2]
          a += radiusPlus1 * src[p + 3]

          for (i = 1; i <= radius; i += 1) {
            p = (srcIndex + (i < width ? i : widthMinus1)) << 2
            r += src[p]
            g += src[p + 1]
            b += src[p + 2]
            a += src[p + 3]
          }

          for (x = 0; x < width; x += 1) {
            p = dstIndex << 2
            dst[p] = sumTable[r]
            dst[p + 1] = sumTable[g]
            dst[p + 2] = sumTable[b]
            dst[p + 3] = sumTable[a]

            nextIndex = x + radiusPlus1
            if (nextIndex > widthMinus1) {
              nextIndex = widthMinus1
            }

            prevIndex = x - radius
            if (prevIndex < 0) {
              prevIndex = 0
            }

            next = (srcIndex + nextIndex) << 2
            prev = (srcIndex + prevIndex) << 2

            r += src[next] - src[prev]
            g += src[next + 1] - src[prev + 1]
            b += src[next + 2] - src[prev + 2]
            a += src[next + 3] - src[prev + 3]

            dstIndex += height
          }
          srcIndex += width
        }
      }

      return (srcImageData, hRadius, vRadius, quality) => {
        var srcPixels = srcImageData.data,
          srcWidth = srcImageData.width,
          srcHeight = srcImageData.height,
          dstImageData = new ImageData(srcWidth, srcHeight),
          dstPixels = dstImageData.data,
          tmpImageData = new ImageData(srcWidth, srcHeight),
          tmpPixels = tmpImageData.data

        for (var i = 0; i < quality; i += 1) {
          // only use the srcPixels on the first loop
          blur(
            i ? dstPixels : srcPixels,
            tmpPixels,
            srcWidth,
            srcHeight,
            hRadius
          )
          blur(tmpPixels, dstPixels, srcHeight, srcWidth, vRadius)
        }

        return dstImageData
      }
    },
    draw() {
      let canvas = document.getElementById('canvas')
      let ctx = canvas.getContext('2d')

      let loadImage = url =>
        new Promise(resolve => {
          const image = new Image()
          image.onload = () => resolve(image)
          image.src = url
        })
      let loadAsset = fileName => loadImage(require('@/assets/img/' + fileName))

      Promise.all([
        loadAsset('background_t.png'),
        loadAsset('background_b.png'),
        loadAsset('background_c.png'),
        loadAsset('background_f.png'),
        loadAsset('card_border.png'),
        loadAsset('new.png'),
        loadAsset('tit.png'),
        loadAsset('star.png'),
        loadAsset('lock.png'),
        loadAsset('border.png'),
        loadAsset(`sign_${this.sign}.png`),
        loadAsset(`flower_${this.flower}.png`),
        loadAsset(`border_${this.border}.png`),
        loadImage(
          this.card.length >= 1
            ? this.card[0].content
            : require('@/assets/img/card_1.png')
        ),
        loadImage(
          this.card.length >= 2
            ? this.card[1].content
            : require('@/assets/img/card_2.png')
        ),
        loadImage(
          this.cardThumb.length >= 1
            ? this.cardThumb[0].content
            : require('@/assets/img/card_thumb.png')
        ),
      ]).then(images => {
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, 512, 1024)

        ctx.drawImage(images[13], 0, 0, 512, 1024) // Background

        let brightness = image => {
          let d = image.data
          for (let i = 0; i < d.length; i += 4) {
            d[i] = d[i] * 2 + 25
            d[i + 1] = d[i + 1] * 2 + 25
            d[i + 2] = d[i + 2] * 2 + 25
          }
          return image
        }

        let img = ctx.getImageData(0, 0, 512, 1024)
        img = brightness(img)
        img = this.blur()(img, 5, 15, 3)
        ctx.putImageData(img, 0, 0)

        ctx.drawImage(images[0], 0, 0) // Background Top
        ctx.drawImage(images[1], 0, 768) // Background Bottom
        ctx.drawImage(images[13], 0, 128, 512, 768) // Card
        ctx.drawImage(images[2], 0, 384) // Background in Card
        ctx.drawImage(images[4], 0, 104, 512, 816) // Card Border

        if (this.isNew) ctx.drawImage(images[5], 0, 64, 154, 123) // New

        ctx.drawImage(images[6], 12, 757, 15, 15) // Little star in the left of Character name
        ctx.drawImage(images[10], 0, 666) // Signature
        ctx.save()
        ctx.font = '28px FZYaSong-M-GBK, STZhongsong, SimSun, NSimSun, STSong'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = '#f9f4db'
        ctx.fillText(this.character, 30, 765)
        ctx.font = '44px FZYaSong-M-GBK, STZhongsong, SimSun, NSimSun, STSong'
        ctx.fillText(this.name, 70, 810)
        ctx.restore()

        if (this.isSecond) {
          ctx.save()
          ctx.rotate(Math.PI / 60)
          ctx.strokeStyle = '#fff'
          ctx.lineWidth = 5
          ctx.lineJoin = 'round'
          ctx.strokeRect(512 * 0.8, 1024 * 0.63, 512 * 0.3, 1024 * 0.225)
          ctx.drawImage(
            images[14],
            512 * 0.8,
            1024 * 0.63,
            512 * 0.3,
            768 * 0.3
          )
          ctx.drawImage(images[8], 512 * 0.8 + 5, 1024 * 0.855 - 30, 20, 24)
          ctx.font = 'bold 16px sans-serif'
          ctx.textBaseline = 'bottom'
          ctx.fillStyle = '#fff'
          ctx.fillText('二段光影', 512 * 0.8 + 30, 1024 * 0.855 - 5)
          ctx.restore()
        }

        if (this.isFlower) {
          ctx.save()
          ctx.drawImage(images[3], 512 * 0.75, 1024 * 0.55 - 10, 512 * 0.25, 36)
          ctx.font = 'bold 18px sans-serif'
          ctx.textBaseline = 'top'
          ctx.fillStyle = '#fff'
          ctx.fillText(this.flowerText, 512 * 0.78 + 72, 1024 * 0.55)
          ctx.drawImage(images[12], 512 * 0.75, 1024 * 0.55 - 24, 72, 72)
          ctx.drawImage(images[11], 512 * 0.75, 1024 * 0.55 - 24, 72, 72)
          ctx.drawImage(images[15], 512 * 0.75 + 1, 1024 * 0.56 + 1, 36, 36)
          ctx.drawImage(images[9], 512 * 0.75, 1024 * 0.56, 38, 38)
          ctx.font = 'bold 14px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(
            '重复获得的灵犀将转换为对应灵犀品质提升道具',
            512 * 0.5,
            1024 * 0.9
          )
          ctx.restore()
        }

        // Stars
        for (let i = 0; i < this.star; i++)
          ctx.drawImage(images[7], 5 + 60 * i, 850, 60, 60)
      })
    },
  },
}
</script>

<style scoped>
.van-theme-dark #canvas {
  filter: brightness(0.8);
}
</style>
