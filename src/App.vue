<template>
  <van-config-provider :theme="theme">
    <router-view />
  </van-config-provider>
</template>

<script>
export default {
  data() {
    let theme = ''
    if (window.matchMedia('(prefers-color-scheme: dark)').matches)
      theme = 'dark'
    return {
      theme,
      homepageActive: 'events',
      dialogSettings: {
        title: '说明',
        messageAlign: 'left',
        closeOnClickOverlay: true,
        theme: 'round-button',
      },
      colors: {
        common: {
          cpr: 'linear-gradient(135deg, #fbe9c3, #e6d8be)',
          gacha: 'linear-gradient(135deg, #91c4cc, #b7ddc0)',
          hoard: 'linear-gradient(135deg, #bbe0f5, #e0f8e0)',
          item: 'linear-gradient(135deg, #f3d7d3, #c4c7e8)',
        },
        events: {
          wish: 'linear-gradient(135deg, #6c71c5, #93a9da)',
        },
      },
    }
  },
  mounted() {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', event => {
        if (event.matches) {
          this.theme = 'dark'
        } else {
          this.theme = ''
        }
      })
  },
}
</script>

<style>
body {
  min-width: 100vw;
  max-width: 425px;
  margin: 0;
  padding-bottom: 20px;
  overflow-x: auto;
  color: #323233;
  font-size: 14px;
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Helvetica Neue',
    Helvetica, 'Segoe UI', Arial, Roboto, 'PingFang SC', miui,
    'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
  background-color: #f7f8fa;
  -webkit-font-smoothing: antialiased;
}

body.van-theme-dark {
  color: rgba(255, 255, 255, 0.75);
  background-color: #202124;
}

#app {
  max-width: 425px;
  margin: auto;
}

.content {
  margin: 5px 16px;
}

.container {
  margin: 16px 0;
}

.center {
  display: block;
  margin: 0 auto;
}

.delete {
  color: rgba(69, 90, 100, 0.6);
  text-decoration-line: line-through;
}

.desc {
  font-size: var(--van-font-size-sm);
  color: var(--van-gray-7);
}
</style>
