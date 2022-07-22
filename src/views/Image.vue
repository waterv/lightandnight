<template>
  <navbar :title="$t('route.image')" no-fix can-return />

  <van-cell-group :title="$t('common.info')" inset>
    <van-cell :title="$t('image.getFont')" is-link @click="showFontInfo" />
    <van-cell title="" :label="$t('image.getFontDesc')" />
  </van-cell-group>

  <van-cell-group :title="$t('image.card')" inset>
    <van-cell :title="$t('image.new')" center>
      <template #right-icon>
        <van-switch v-model="isNew" size="24" />
      </template>
    </van-cell>
    <van-field
      v-model="signSelected"
      is-link
      readonly
      :label="$t('image.sign')"
      @click="showSignPicker = true"
    />
    <van-field v-model="char" :label="$t('image.char')" autocomplete="off" />
    <van-field v-model="name" :label="$t('image.name')" autocomplete="off" />
    <van-cell :title="$t('image.star')" center>
      <template #right-icon>
        <van-stepper v-model="star" v-bind="stepper" min="1" max="8" />
      </template>
    </van-cell>
    <van-cell :title="$t('image.second')" center>
      <template #right-icon>
        <van-switch v-model="isSecond" size="24" />
      </template>
    </van-cell>
    <van-cell :title="$t('image.flower.name')" center>
      <template #right-icon>
        <van-switch v-model="isFlower" size="24" @change="onFlowerChange" />
      </template>
    </van-cell>
    <template v-if="isFlower">
      <van-cell :title="$t('image.star')" icon="arrow" center>
        <template #right-icon>
          <van-stepper v-model="flower" v-bind="stepper" min="3" max="6" />
        </template>
      </van-cell>
      <van-cell :title="$t('image.flower.border')" icon="arrow" center>
        <template #right-icon>
          <van-stepper v-model="border" v-bind="stepper" min="3" max="6" />
        </template>
      </van-cell>
      <van-field
        v-model="flowerText"
        left-icon="arrow"
        :label="$t('image.flower.number')"
        autocomplete="off"
      />
    </template>
    <van-field
      v-model="markSelected"
      is-link
      readonly
      :label="$t('image.mark')"
      @click="showMarkPicker = true"
    />
  </van-cell-group>

  <van-cell-group :title="$t('image.image')" inset>
    <van-cell :label="$t('image.imageDesc')">
      <template #title>
        <van-uploader v-model="card" multiple :max-count="2" />
      </template>
    </van-cell>
    <van-cell :label="$t('image.thumbDesc')">
      <template #title>
        <van-uploader v-model="cardThumb" multiple :max-count="1" />
      </template>
    </van-cell>
  </van-cell-group>

  <van-cell-group title=" " inset>
    <van-cell :title="$t('image.generate')" center is-link @click="draw" />
  </van-cell-group>

  <van-divider />

  <canvas id="canvas" :width="512" :height="1024" style="display: none" />
  <img v-if="dataURL" :src="dataURL" style="width: 100%" />

  <van-popup v-model:show="showSignPicker" v-bind="popup">
    <van-picker :columns="signColumn" @confirm="onSignConfirm" />
  </van-popup>

  <van-popup v-model:show="showMarkPicker" v-bind="popup">
    <van-picker :columns="markColumn" @confirm="onMarkConfirm" />
  </van-popup>
</template>

<script>
import { useWindowSize } from '@vant/use'
import { Uploader, showDialog, showLoadingToast, closeToast } from 'vant'
import Navbar from '@/components/Navbar.vue'

let blur = () => {
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
      blur(i ? dstPixels : srcPixels, tmpPixels, srcWidth, srcHeight, hRadius)
      blur(tmpPixels, dstPixels, srcHeight, srcWidth, vRadius)
    }

    return dstImageData
  }
}

let brightness = image => {
  let d = image.data
  for (let i = 0; i < d.length; i += 4) {
    d[i] = d[i] * 2 + 25
    d[i + 1] = d[i + 1] * 2 + 25
    d[i + 2] = d[i + 2] * 2 + 25
  }
  return image
}

export default {
  name: 'ImageGenerator',
  components: {
    [Uploader.name]: Uploader,
    Navbar,
  },
  data() {
    let { width } = useWindowSize()
    let signColumn = [
      'Osborn',
      'Evan',
      'Sariel',
      'Jesse',
      'Charlie',
      'Bluebird',
    ].map((text, value) => ({
      text,
      value,
      char: this.$t(`characters[${value}]`),
    }))
    let markColumn = [0, 1].map(value => ({
      text: this.$t(`image.marks[${value}]`),
      value,
    }))
    return {
      sign: 5,
      mark: 0,
      signColumn,
      markColumn,
      signSelected: signColumn[5].text,
      markSelected: this.$t('image.marks[0]'),
      showSignPicker: false,
      showMarkPicker: false,
      isNew: true,
      char: signColumn[5].char,
      name: this.$t('image.default.name'),
      star: 6,
      isSecond: true,
      isFlower: false,
      flower: 6,
      border: 6,
      flowerText: this.$t('image.default.flower.number'),
      card: [],
      cardThumb: [],
      width: Math.min(width.value, 425),
      dataURL: '',
      stepper: {
        integer: true,
        'input-width': '48px',
      },
      popup: {
        round: true,
        position: 'bottom',
        'safe-area-inset-bottom': true,
      },
    }
  },
  mounted() {
    let canvas = document.getElementById('canvas')
    let ctx = canvas.getContext('2d')
    canvas.style.width = canvas.width + 'px'
    canvas.style.height = canvas.height + 'px'
    canvas.width = 512
    canvas.height = 1024
    let ratio = canvas.width / 512
    ctx.scale(ratio, ratio)
    this.draw()
  },
  methods: {
    showFontInfo() {
      showDialog({
        ...this.$root.dialogSettings,
        message: this.$t('hint.image'),
        confirmButtonText: this.$t('image.getFontConfirm'),
        showCancelButton: true,
      })
        .then(() => {
          window.open(
            'https://www.foundertype.com/index.php/FontInfo/index/id/193'
          )
        })
        .catch(() => {})
    },
    onSignConfirm({ selectedOptions }) {
      this.showSignPicker = false
      this.sign = selectedOptions[0].value
      this.signSelected = selectedOptions[0].text
      this.char = selectedOptions[0].char
    },
    onMarkConfirm({ selectedOptions }) {
      this.showMarkPicker = false
      this.mark = selectedOptions[0].value
      this.markSelected = selectedOptions[0].text
    },
    onFlowerChange() {
      this.flower = Math.max(Math.min(this.star, 6), 3)
      this.border = Math.max(Math.min(this.star, 6), 3)
    },
    draw() {
      let toast = showLoadingToast({
        message: this.$t('common.loading'),
        forbidClick: true,
        duration: 0,
      })

      let canvas = document.getElementById('canvas')
      let ctx = canvas.getContext('2d')

      let loadImage = url => {
        return new Promise(resolve => {
          const image = new Image()
          image.onload = () => resolve(image)
          image.src = url
        })
      }
      let loadAsset = fileName => {
        toast.message = this.$t('common.loading', [fileName])
        return loadImage(require(`@/assets/Image/${fileName}`))
      }

      Promise.all([
        loadAsset('background_top.png'),
        loadAsset('background_bottom.png'),
        loadAsset('background_card.png'),
        loadAsset('background_float.png'),
        loadAsset('card_border.png'),
        loadAsset('new.png'),
        loadAsset('tit.png'),
        loadAsset('star.png'),
        loadAsset('lock.png'),
        loadAsset('border.png'),
        loadAsset(`sign_${this.sign}.png`),
        loadAsset(`flower_${this.flower}.png`),
        loadAsset(`border_${this.border}.png`),
        loadAsset(`mark_${this.mark}.png`),
        loadImage(
          this.card[0]?.content || require('@/assets/Image/card_1.png')
        ),
        loadImage(
          this.card[1]?.content || require('@/assets/Image/card_2.png')
        ),
        loadImage(
          this.cardThumb[0]?.content || require('@/assets/Image/card_thumb.png')
        ),
      ]).then(images => {
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, 512, 1024)

        ctx.drawImage(images[14], 0, 0, 512, 1024) // Background

        let img = ctx.getImageData(0, 0, 512, 1024)
        img = brightness(img)
        img = blur()(img, 5, 15, 3)
        ctx.putImageData(img, 0, 0)

        ctx.drawImage(images[0], 0, 0) // Background Top
        ctx.drawImage(images[1], 0, 768) // Background Bottom
        ctx.drawImage(images[14], 0, 128, 512, 768) // Card
        ctx.drawImage(images[2], 0, 384) // Background in Card
        ctx.drawImage(images[4], 0, 104, 512, 816) // Card Border

        if (this.isNew) ctx.drawImage(images[5], 0, 64, 154, 123) // New

        ctx.drawImage(images[6], 12, 757, 15, 15) // Little star in the left of char name
        ctx.drawImage(images[10], 0, 666) // Signature
        ctx.drawImage(images[13], 0, 774, 80, 80) // Signature
        ctx.save()
        ctx.font = '28px FZYaSong-M-GBK, STZhongsong, SimSun, NSimSun, STSong'
        ctx.textBaseline = 'middle'
        ctx.fillStyle = '#f9f4db'
        ctx.fillText(this.char, 30, 765)
        ctx.font = '44px FZYaSong-M-GBK, STZhongsong, SimSun, NSimSun, STSong'
        ctx.fillText(this.name, 70, 810)
        ctx.restore()

        if (this.isSecond) {
          ctx.save()
          ctx.rotate(Math.PI / 60)
          ctx.strokeStyle = '#fff'
          ctx.lineWidth = 5
          ctx.lineJoin = 'round'
          ctx.strokeRect(400, 645, 153, 230)
          ctx.drawImage(images[15], 400, 645, 153, 230)
          ctx.drawImage(images[8], 405, 845, 20, 24)
          ctx.font = 'bold 16px sans-serif'
          ctx.textBaseline = 'bottom'
          ctx.fillStyle = '#fff'
          ctx.fillText(this.$t('image.second'), 440, 870)
          ctx.restore()
        }

        if (this.isFlower) {
          ctx.save()
          ctx.drawImage(images[3], 384, 553, 128, 36)
          ctx.font = 'bold 18px sans-serif'
          ctx.textBaseline = 'top'
          ctx.fillStyle = '#fff'
          ctx.fillText(this.flowerText, 471, 563)
          ctx.drawImage(images[12], 384, 539, 72, 72)
          ctx.drawImage(images[11], 384, 539, 72, 72)
          ctx.drawImage(images[16], 385, 574, 36, 36)
          ctx.drawImage(images[9], 384, 573, 38, 38)
          ctx.font = 'bold 14px sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(this.$t('image.flowerDesc'), 256, 921)
          ctx.restore()
        }

        // Stars
        for (let i = 0; i < this.star; i++)
          ctx.drawImage(images[7], 5 + 56 * i, 850, 60, 60)

        closeToast()
        this.dataURL = canvas.toDataURL('image/png')
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
