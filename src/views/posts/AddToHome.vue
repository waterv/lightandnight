<template>
  <navbar title="添加到主屏幕" can-return />

  <van-tabs v-model:active="active" scrollspy sticky offset-top="46">
    <div class="content">
      <van-tab title="iOS">
        <h2>iOS</h2>
        <p>1. 打开浏览器的「 <share-ios height="14" /> 共享」菜单。如果您使用 Safari 浏览器，该按钮位于下方中间位置。</p>
        <p>2. 在弹出的窗口中，选择列表中的「 <add-ios height="14" /> 添加到主屏幕」。</p>
      </van-tab>
      <van-tab title="Android 1" class="container">
          <h2>Android App</h2>
          <p>由于 Android 系统的情况较为复杂，我们使用 Fusion App 软件，将网站打包成了 App，方便您直接下载使用。</p>
          <p>这样打包出的软件，比起网页并不附带其他任何额外功能，俗称「套壳浏览器」，其形式类似于游戏中出现的「外链活动」。</p>
          <p>由于没有应用商店审核，安装时<strong>可能会提示不安全，请您手动放行</strong>。除了需要网络连接，该 App 理论上无需其他任何权限，如有申请可以拒绝。</p>
          <p><strong>如果不放心</strong>，可自行使用 Fusion App 等工具打包，或者参考下一节给出其他的解决方案。</p>
          <van-button icon="down" type="success" block url="/lightandnight/android.apk">下载 Android App</van-button>
      </van-tab>
      <van-tab title="Android 2" class="container">
        <h2>Android 桌面快捷方式</h2>
        <p>下面给出一些浏览器添加桌面快捷方式的方法。这些方法可能在浏览器的后续版本中失效、或改变入口位置，请您耐心寻找。</p>
        <p><strong>注意</strong>：请事先确认浏览器拥有「添加桌面快捷方式」的权限。如果不明白如何操作，可搜索「手机品牌 + 权限管理」。</p>
        <p><strong>注意</strong>：部分浏览器可能不遵循 PWA 规范，导致本页面（而非本工具首页）的快捷方式被添加到桌面。如果真的如此，请删除原快捷方式，在本工具首页重新操作。</p>
        <p><strong>经测试不支持的浏览器</strong>：Microsoft Edge、Via、X 浏览器、Alook、夸克、简单搜索、百度极速版。</p>
        <h3><van-tag type="primary">推荐</van-tag> Chrome、Firefox</h3>
        <p>打开浏览器菜单，选择「添加到主屏幕」。</p>
        <h3>UC 浏览器、UC 浏览器极速版</h3>
        <p>1. 打开浏览器菜单，选择「收藏网址」。</p>
        <p>2. 点击对话框中的「编辑」按钮，选中「添加至 - 手机桌面」，选择「确定」。</p>
        <p>3. （UC 浏览器）或者打开浏览器菜单，选择「收藏/历史」，点击本站一行的「…」，选择「添加到桌面」。</p>
        <p>4. （UC 浏览器极速版）或者打开浏览器菜单，选择「收藏/历史」，长按本站一行，选择「发送至桌面」。</p>
        <h3>华为浏览器（花瓣浏览器）、欧朋浏览器、Pure 浏览器</h3>
        <p>打开浏览器菜单，选择「添加至 / 收藏 / 添加」，选择「添加至 - 桌面 / 添加至 - 手机桌面 / 添加到 - 桌面」。</p>
        <h3>猎豹浏览器、360 浏览器（360 极速浏览器）、M 浏览器</h3>
        <p>1. 打开浏览器菜单，选择「添加收藏 / 收藏网址 / 添加书签」。</p>
        <p>2. 打开浏览器菜单，选择「收藏/历史 / 收藏夹 / 书签」，长按本站一行，选择「发送桌面 / 发送至手机桌面 / 放到桌面」。</p>
        <h3>百度</h3>
        <p>打开浏览器菜单，滑动到最后，选择「添加到桌面」。</p>
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
  data () {
    return {
      active: 0,
    }
  },
  methods: {
    openIOSShare () {
      let shareData = {
        title: 'MDN',
        text: 'Learn web development on MDN!',
        url: 'https://developer.mozilla.org',
      }
      let navigator = window.navigator
      navigator.share(shareData)
    }
  }
}
</script>