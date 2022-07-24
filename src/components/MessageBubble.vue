<template>
  <div class="bubble-box" :class="{ self, oppo: !self }">
    <van-icon class="avatar" :name="avatar" size="40" />
    <template v-if="data.type != 3">
      <div class="triangle-border" />
      <div class="triangle" />
    </template>
    <template v-if="data.type == 0">
      <!-- Message -->
      <div class="bubble">{{ data.content }}</div>
    </template>
    <template v-else-if="data.type == 1">
      <!-- Voice -->

      <div class="bubble voice">{{ data.length }}</div>
    </template>
    <template v-else-if="data.type == 2">
      <!-- Call -->
      <div class="bubble">
        {{ data.content || $t(`phone.message.calls[${Number(data.state)}]`) }}
      </div>
    </template>
    <template v-else-if="data.type == 3">
      <!-- Image -->
      <img class="image" :src="data.src" />
    </template>
    <template v-else>
      <!-- Redpack -->
      <div class="bubble redpack">{{ data.content }}</div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'MessageBubble',
  props: {
    data: Object,
    avatar: String,
    self: Boolean,
  },
}
</script>

<style scoped>
.bubble-box {
  --background: #fff;
  position: relative;
  margin: var(--van-cell-horizontal-padding);
}

.van-theme-dark .bubble-box {
  --background: #1c1c1e;
}

.self.bubble-box {
  --background: #e8a0b4;
}

.avatar {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 5px;
  overflow: hidden;
}

.self .avatar {
  left: unset;
  right: 0;
}

.bubble {
  border-radius: 5px;
  background-color: var(--background);
  width: fit-content;
  max-width: 70%;
  min-width: 20px;
  min-height: 20px;
  padding: 10px;
  position: relative;
  font-size: var(--van-cell-large-title-font-size);
  text-align: left;
  box-shadow: 0 0 1px 1px rgb(0, 0, 0, 0.1);
  margin-left: 50px;
  z-index: 1;
}

.image {
  min-width: 40px;
  min-height: 40px;
  border-radius: 5px;
  overflow: hidden;
  margin-left: 50px;
  z-index: 1;
}

.self .bubble,
.self .image {
  margin-left: auto;
  margin-right: 50px;
  color: white;
}

.triangle-border {
  position: absolute;
  content: ' ';
  left: 38px;
  top: 14px;
  width: 0;
  height: 0;
  border: 6px solid transparent;
  border-right-color: rgba(0, 0, 0, 0.1);
}

.self .triangle-border {
  left: unset;
  right: 38px;
  border-left-color: rgb(0, 0, 0, 0.1);
  border-right-color: transparent;
}

.triangle {
  position: absolute;
  content: ' ';
  left: 40px;
  top: 15px;
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-right-color: var(--background);
  z-index: 2;
}

.self .triangle {
  left: unset;
  right: 40px;
  border-left-color: var(--background);
  border-right-color: transparent;
}
</style>
