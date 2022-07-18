<template>
  <van-config-provider :theme="theme" :theme-vars="themeVars">
    <router-view />
  </van-config-provider>
</template>

<script>
import VConsole from 'vconsole'

export default {
  data() {
    let theme = ''
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) theme = 'dark'
    return {
      theme,
      developerMode: false,
      vConsoleOpen_: false,
      vConsole: undefined,
      homepageActive: 'events',
      dialogSettings: {
        title: this.$t('common.info'),
        messageAlign: 'left',
        closeOnClickOverlay: true,
      },
      themeVars: {
        navBarBackground: '#212121',
        navBarTitleTextColor: '#ffffff',
        navBarTextColor: '#ffffff',
        navBarIconColor: '#ffffff',
      },
    }
  },
  computed: {
    vConsoleOpen: {
      get() {
        return this.vConsoleOpen_
      },
      set(v) {
        this.vConsoleOpen_ = v
        if (v) this.vConsole = new VConsole({ theme: this.theme })
        else this.vConsole?.destroy()
      },
    },
  },
  mounted() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
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
  overflow-x: hidden;
  color: #323233;
  font-size: 14px;
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica,
    'Segoe UI', Arial, Roboto, 'PingFang SC', miui, 'Hiragino Sans GB', 'Microsoft Yahei',
    sans-serif;
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
