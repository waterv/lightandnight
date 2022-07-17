<template>
  <navbar title="添加到主屏幕" can-return />

  <van-tabs v-model:active="active" scrollspy sticky offset-top="46">
    <div class="content">
      <van-tab title="WebApp">
        <h2>WebApp</h2>
        <ul>
          <li>通过这种方式添加到主屏幕，可在缓存资源后离线使用。</li>
          <li>可能需要加载完所有资源后才能添加。</li>
        </ul>
        <h3>iOS</h3>
        <ol>
          <li>打开浏览器的「<share-ios height="14" :fill="fill" /> 共享」菜单。如果您使用 Safari 浏览器，该按钮位于下方中间位置。</li>
          <li>在弹出的窗口中，选择列表中的「<add-ios height="14" :fill="fill" /> 添加到主屏幕」。</li>
        </ol>
        <h3>Android</h3>
        <ol>
          <li>下载并安装 Google Chrome 浏览器。</li>
          <li>在 Google Chrome 浏览器中打开本站，打开浏览器菜单，选择「添加到主屏幕」。</li>
        </ol>
      </van-tab>
      <van-tab title="Android App" class="container">
        <h2>Android App</h2>
        <ul>
          <li>这是使用 Fusion App 软件将 GitHub Pages 镜像打包制成的 App，可直接下载使用，但无法离线使用。</li>
          <li>这样打包出的软件俗称「套壳浏览器」，类似于游戏中出现的「外链活动」。</li>
          <li>由于未经应用商店审核，安装时<strong>可能会提示不安全，请您手动放行</strong>。</li>
          <li>除了网络连接等必要权限，该 App 理论上无需申请其他任何权限，如有申请可以拒绝。</li>
          <li><strong>如果不放心</strong>，可自行使用 Fusion App 等工具打包，或者参考下一节给出的其他解决方案。</li>
        </ul>
        <van-button
          icon="down"
          type="success"
          class="button-download"
          block
          url="https://waterv.github.io/lightandnight/android.apk"
        >
          下载 Android App
        </van-button>
      </van-tab>
      <van-tab title="桌面快捷方式" class="container">
        <h2>桌面快捷方式</h2>
        <ul>
          <li>下面给出一些浏览器添加桌面快捷方式的方法。</li>
          <li>这些方法仅仅是在桌面添加了快捷入口，无法离线使用。</li>
          <li>这些方法可能在浏览器的后续版本中失效、或改变入口位置，请您耐心寻找。</li>
          <li>请事先确认浏览器拥有「添加桌面快捷方式」的权限。如果不明白如何操作，可搜索「手机品牌 + 权限管理」。</li>
          <li>部分浏览器可能不遵循 PWA 规范，导致本页（而非首页）的快捷方式被添加到桌面。如果真的如此，请删除原快捷方式，在本工具首页重新操作。</li>
        </ul>
        <h3>经测试不支持的浏览器</h3>
        <ul>
          <li>Microsoft Edge</li>
          <li>Via</li>
          <li>X 浏览器</li>
          <li>Alook</li>
          <li>夸克</li>
          <li>简单搜索</li>
          <li>百度极速版</li>
        </ul>
        <h3>UC 浏览器、UC 浏览器极速版</h3>
        <van-tabs v-model:active="actives[0]" type="card" class="tab-browser">
          <van-tab title="UC" />
          <van-tab title="UC 极速版" />
        </van-tabs>
        <ol>
          <li>[菜单] — [收藏网址]</li>
          <li>
            [编辑] — [添加至 - 手机桌面] — [确定]，或<br />
            [菜单] — [收藏/历史] —
            找到新增的收藏项，{{actives[0] == 0 ? '点击 [...]' : '长按之'}} —
            [{{actives[0] == 0 ? '添加到' : '发送至'}}桌面]
          </li>
        </ol>
        <h3>华为 / 花瓣浏览器、欧朋浏览器、Pure 浏览器</h3>
        <van-tabs v-model:active="actives[1]" type="card" class="tab-browser">
          <van-tab title="华为 / 花瓣" />
          <van-tab title="欧朋" />
          <van-tab title="Pure" />
        </van-tabs>
        <ol>
          <li>
            [菜单] — [{{actives[1] == 0 ? '添加至' : actives[1] == 1 ? '收藏' : '添加'}}] —
            [{{actives[1] == 0 ? '添加至 - 桌面' : actives[1] == 1 ? '添加至 - 手机桌面' : '添加到 - 桌面'}}]
          </li>
        </ol>
        <h3>猎豹浏览器、360（极速）浏览器、M 浏览器</h3>
        <van-tabs v-model:active="actives[2]" type="card" class="tab-browser">
          <van-tab title="猎豹" />
          <van-tab title="360 (极速)" />
          <van-tab title="M" />
        </van-tabs>
        <ol>
          <li>[菜单] — [{{actives[2] == 0 ? '添加收藏' : actives[2] == 1 ? '收藏网址' : '添加书签'}}]</li>
          <li>
            [菜单] — [{{actives[2] == 0 ? '收藏/历史' : actives[2] == 1 ? '收藏夹' : '书签'}}] —
            找到新增的收藏项，长按之 —
            [{{actives[2] == 0 ? '发送桌面' : actives[2] == 1 ? '发送至手机桌面' : '放到桌面'}}]
          </li>
        </ol>
        <h3>Firefox、百度</h3>
        <ol>
          <li>[菜单] — [添加到桌面]</li>
        </ol>
      </van-tab>
    </div>
  </van-tabs>
</template>

<script>
import { Tag } from 'vant'
import Navbar from '@/components/Navbar.vue'
import ShareIos from '@/icons/ShareIos.vue'
import AddIos from '@/icons/AddIos.vue'

export default {
  name: 'AddToHome',
  components: {
    [Tag.name]: Tag,
    Navbar,
    ShareIos,
    AddIos,
  },
  data: () => ({
    active: 0,
    actives: [0, 0, 0],
  }),
  computed: {
    fill() {
      return this.$root.theme == 'dark' ? '#fff' : '#323233'
    },
  },
}
</script>

<style scoped>
ul {
  padding-left: 40px;
  list-style: unset;
}

ol {
  padding-left: 40px;
  list-style: decimal;
}

.button-download {
  margin-top: 14px;
}

.tab-browser {
  margin-bottom: 14px;
}
</style>