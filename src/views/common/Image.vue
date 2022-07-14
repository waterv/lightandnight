<template>
  <navbar title="欧皇模拟器" can-return />

  <van-cell-group title="说明" inset>
    <van-cell
      title=""
      label="由于引用的图片资源较多，本页可能加载较长时间，请耐心等候。角色与灵犀名需要使用「方正准雅宋 GBK」字体，建议您使用安装有该字体的电脑访问本页。"
    />
    <van-cell title="获取「方正准雅宋 GBK」字体" is-link @click="showFontInfo" />
  </van-cell-group>

  <van-cell-group title="灵犀信息" inset>
    <van-field
      v-model="signSelected"
      is-link
      readonly
      label="签名"
      placeholder="选择签名"
      @click="showSignPicker = true"
    />
    <van-field v-model="character" label="角色" autocomplete="off" />
    <van-field v-model="name" label="灵犀名称" autocomplete="off" />
    <van-cell title="星级" center>
      <template #right-icon>
        <van-stepper v-model="star" integer min="1" max="8" />
      </template>
    </van-cell>
    <van-cell title="二段光影" center>
      <template #right-icon>
        <van-switch v-model="isSecond" size="24" />
      </template>
    </van-cell>
    <van-cell title="「瑰意」标记" center>
      <template #right-icon>
        <van-switch v-model="mark" size="24" />
      </template>
    </van-cell>
  </van-cell-group>

  <van-cell-group title="玩家信息" inset>
    <van-cell title="获得新卡 (New)" center>
      <template #right-icon>
        <van-switch v-model="isNew" size="24" />
      </template>
    </van-cell>
    <van-cell title="获得勿忘" center>
      <template #right-icon>
        <van-switch v-model="isFlower" size="24" @change="onFlowerChange" />
      </template>
    </van-cell>
    <template v-if="isFlower">
      <van-cell title="勿忘星级" icon="arrow" center>
        <template #right-icon>
          <van-stepper v-model="flower" integer min="3" max="6" input-width="64px" />
        </template>
      </van-cell>
      <van-cell title="边框星级" icon="arrow" center>
        <template #right-icon>
          <van-stepper v-model="border" integer min="3" max="6" input-width="64px" />
        </template>
      </van-cell>
      <van-field v-model="flowerText" label="数量" left-icon="arrow" autocomplete="off" />
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

  <van-cell-group title=" " inset>
    <van-cell title="生成图片" center is-link @click="generate" />
  </van-cell-group>

  <van-divider />

  <canvas id="canvas" width="512" height="1024" style="display: none" />
  <img v-if="dataUri" :src="dataUri" style="width: 100%" />

  <van-popup v-model:show="showSignPicker" round position="bottom">
    <van-picker :columns="signColumn" @confirm="onSignConfirm" />
  </van-popup>
</template>

<script>
import { useWindowSize } from '@vant/use'
import { Uploader, Toast } from 'vant'
import Navbar from '@/components/Navbar.vue'
import Jimp from 'jimp'

export default {
  name: 'Image',
  components: {
    [Uploader.name]: Uploader,
    [Toast.name]: Toast,
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
      mark: 0,
      star: 6,
      isSecond: true,
      isFlower: false,
      flower: 6,
      border: 6,
      flowerText: '+1',
      card: [],
      cardThumb: [],
      width: Math.min(width.value, 425),
      dataUri: undefined,
    }
  },
  methods: {
    showFontInfo() {
      this.$dialog
        .alert({
          ...this.$root.dialogSettings,
          message:
            '使用「方正准雅宋 GBK」字体需要获得授权，其中「个人非商业授权」可按照以下步骤免费获得：\n\n' +
            '1. 登陆方正字库官网，认真阅读并同意相关许可协议。\n' +
            '2. 在「方正雅宋家族」页面的「字体样式」下找到「方正准雅宋」，点击它右侧的「获取字体」。\n' +
            '3. 点击右侧浮动菜单中的「清单 - 字体清单」。\n' +
            '4. 在弹出的页面中，将「字符集」改为「繁简扩展 (GBK)」，然后点击右下角的「获得字体」。\n' +
            '5. 再次确认后，即可在「我的字体」中找到「下载字体」。\n\n' +
            '下载字体并安装后，重新启动浏览器，一般就可以正常调用该字体。',
          confirmButtonText: '前往方正字库官网',
          cancelButtonText: '关闭',
          showCancelButton: true,
        })
        .then(() => {
          window.open('https://www.foundertype.com/index.php/FontInfo/index/id/193')
        })
        .catch(() => {})
    },
    onSignConfirm({ selectedOptions }) {
      this.showSignPicker = false
      this.sign = selectedOptions[0].value
      this.signSelected = selectedOptions[0].text
      this.character = selectedOptions[0].character
    },
    onFlowerChange() {
      this.flower = Math.max(Math.min(this.star, 6), 3)
      this.border = Math.max(Math.min(this.star, 6), 3)
    },
    generate() {
      let toast = Toast.loading({
        message: '加载中',
        forbidClick: true,
        duration: 0,
      })
      let { w, h } = { w: 512, h: 1024 }
      let asset = fileName => {
        toast.message = `${fileName} 加载中`
        return require('@/assets/img/Image/' + fileName)
      }
      Jimp.read(this.card[0]?.content || asset('card_1.png'))
        .then(img => {
          toast.message = '处理背景中'
          let imgClone = img.clone()
          img = img.resize(w, h)
          // Brightness
          for (let x = 0; x < w; x++)
            for (let y = 0; y < h; y++) {
              let { r, g, b, a } = Jimp.intToRGBA(img.getPixelColor(x, y))
              let p = v => Math.min(255, 2 * v + 25)
              img.setPixelColor(Jimp.rgbaToInt(p(r), p(g), p(b), a), x, y)
            }
          img = img.blur(5)
          let composite = (img, fileName, x, y, w, h) => {
            return Jimp.read(asset(fileName)).then(src =>
              img.composite(w ? src.resize(w, h) : src, x, y)
            )
          }
          return composite(img, 'background_top.png', 0, 0)
            .then(img => composite(img, 'background_bottom.png', 0, 768))
            .then(img => img.composite(imgClone.resize(w, 768), 0, 128))
            .then(img => composite(img, 'background_card.png', 0, 384))
            .then(img => composite(img, 'card_border.png', 0, 104, w, 816))
            .then(img => (this.isNew ? composite(img, 'new.png', 0, 64, 154, 123) : img))
            .then(img => composite(img, `sign_${this.sign}.png`, 0, 666))
            .then(img => composite(img, 'tit.png', 12, 757, 15, 15))
            .then(img => {
              if (!this.mark) return img
              return composite(img, 'mark_1.png', 0, 774, 80, 80)
            })
            .then(img => {
              if (!this.isFlower) return img
              return composite(img, 'background_float.png', 384, 553, 128, 36)
                .then(img => composite(img, `border_${this.border}.png`, 384, 539, 72, 72))
                .then(img => composite(img, `flower_${this.flower}.png`, 384, 539, 72, 72))
                .then(img =>
                  Jimp.read(this.cardThumb[0]?.content || asset('card_thumb.png')).then(src =>
                    img.composite(src.resize(36, 36), 385, 575)
                  )
                )
                .then(img => composite(img, 'border.png', 384, 574, 38, 38))
            })
            .then(img => {
              return Jimp.read(asset('star.png')).then(src => {
                for (let i = 0; i < this.star; i++)
                  img = img.composite(src.resize(60, 60), 56 * i + 5, 850)
                return img
              })
            })
        })
        .then(img => img.getBase64Async(Jimp.MIME_PNG))
        .then(dataUri => {
          let canvas = document.getElementById('canvas')
          let ctx = canvas.getContext('2d')
          let loadImage = url =>
            new Promise(resolve => {
              const image = new Image()
              image.onload = () => resolve(image)
              image.src = url
            })
          return Promise.all([
            loadImage(dataUri),
            loadImage(this.card[1]?.content || asset('card_2.png')),
            loadImage(asset('lock.png')),
          ]).then(imgs => {
            ctx.drawImage(imgs[0], 0, 0)
            {
              ctx.save()
              ctx.font = '28px FZYaSong-M-GBK, STZhongsong, SimSun, NSimSun, STSong'
              ctx.textBaseline = 'middle'
              ctx.fillStyle = '#f9f4db'
              ctx.fillText(this.character, 30, 765)
              ctx.font = '44px FZYaSong-M-GBK, STZhongsong, SimSun, NSimSun, STSong'
              ctx.fillText(this.name, 70, 810)
              ctx.restore()
            }
            if (this.isSecond) {
              ctx.save()
              ctx.rotate(Math.PI / 60)
              ctx.strokeStyle = '#fff'
              ctx.lineWidth = 5
              ctx.lineJoin = 'round'
              ctx.strokeRect(512 * 0.78, 1024 * 0.63, 512 * 0.3, 1024 * 0.225)

              ctx.drawImage(imgs[1], 512 * 0.78, 1024 * 0.63, 512 * 0.3, 768 * 0.3)
              ctx.drawImage(imgs[2], 512 * 0.78 + 5, 1024 * 0.855 - 30, 20, 24)
              ctx.font = 'bold 16px sans-serif'
              ctx.textBaseline = 'bottom'
              ctx.fillStyle = '#fff'
              ctx.fillText('二段光影', 512 * 0.78 + 30, 1024 * 0.855 - 5)
              ctx.restore()
            }
            if (this.isFlower) {
              ctx.save()
              ctx.font = 'bold 18px sans-serif'
              ctx.textBaseline = 'top'
              ctx.fillStyle = '#fff'
              ctx.fillText(this.flowerText, 512 * 0.78 + 72, 1024 * 0.55)
              ctx.font = 'bold 14px sans-serif'
              ctx.textAlign = 'center'
              ctx.fillText('重复获得的灵犀将转换为对应灵犀品质提升道具', 512 * 0.5, 1024 * 0.9)
              ctx.restore()
            }
            this.dataUri = canvas.toDataURL('image/png')
            Toast.clear()
            Toast.success('生成成功，请您长按保存')
          })
        })
    },
  },
}
</script>
