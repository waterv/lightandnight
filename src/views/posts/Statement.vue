<template>
  <navbar title="关于与声明" can-return />

  <van-tabs v-model:active="active" scrollspy sticky offset-top="46">
    <div class="content">
      <van-tab title="关于">
        <h2>关于</h2>
        <p>
          这是北极光工作室手机游戏《光与夜之恋》相关小工具集合，包含各类计算器与抽卡模拟器。
        </p>
        <p>
          欢迎大家使用，如果认为好用，欢迎随意分享；如果有任何想法、建议、希望添加的功能，或者发现了任何
          bug，欢迎到 GitHub 提 issue、pull request 或者到我的微博提出。
        </p>
        <p>
          本工具并未对宽屏幕进行优化，建议您在移动设备上竖屏使用本工具，以获得较好的显示效果。
        </p>
        <van-button type="danger" block url="https://weibo.com/paandaa">
          <template #icon><weibo height="12" fill="white" /></template>
          <template #default>作者微博</template></van-button
        >
        <van-button
          color="#25292e"
          block
          url="https://github.com/waterv/lightandnight"
        >
          <template #icon><git-hub height="12" fill="white" /></template>
          <template #default>GitHub 仓库</template></van-button
        >
      </van-tab>
      <van-tab title="声明">
        <h2>声明</h2>
        <p>
          本工具为玩家为爱发电产物，目前分支仅由一人维护。非官方，且与任何其他玩家组织无关。
        </p>
        <p>
          本工具数据均来自官方公示数据，需手动同步更新，可能存在更新延迟、数据错误、跑路等风险，请以游戏中实际情况为准。
        </p>
        <p>
          本工具中所引用的游戏资源，包括但不限于图片、文本等，仅用于表现游戏内容与增强用户体验，其版权属于北极光工作室。
        </p>
        <p>
          本工具在 GitHub
          平台开放源代码，不会商用。如果您在页面上看到广告，可能是您的浏览器自带，可尝试更换浏览器；或者是您的网络被污染或劫持，请联系您的网络运营商解决。
        </p>
      </van-tab>
      <van-tab title="后事…？">
        <h2>如果我跑路了</h2>
        <p>
          如果我后续突然跑路了，GitHub 仓库大概率会依然保留。如果您了解 Vue
          并且愿意接手屎山代码，欢迎您通过 clone、fork 等方式参与后续维护更新。
        </p>
      </van-tab>
    </div>
  </van-tabs>
</template>

<script>
import Navbar from '@/components/Navbar.vue'
import Weibo from '@/icons/Weibo.vue'
import GitHub from '@/icons/GitHub.vue'

export default {
  name: 'Statement',
  components: {
    Navbar,
    Weibo,
    GitHub,
  },
  data() {
    return {
      active: 0,
    }
  },
}
</script>

<style scoped>
.van-button + .van-button {
  margin-top: 5px;
}
</style>
