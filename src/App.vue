<template>
  <router-view/>
</template>

<script>
export default {
  data () {
    return {
      homepageActive: 'events',
    }
  }
}
</script>

<style>
body {
  min-width: 100vw;
  margin: 0;
  padding-bottom: 20px;
  overflow-x: auto;
  color: #323233;
  font-size: 14px;
  font-family: "Open Sans", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Helvetica, "Segoe UI", Arial, Roboto, "PingFang SC", miui, "Hiragino Sans GB", "Microsoft Yahei", sans-serif;
  background-color: #f7f8fa;
  -webkit-font-smoothing: antialiased;
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
