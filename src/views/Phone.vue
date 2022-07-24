<template>
  <van-config-provider :theme-vars="theme">
    <van-nav-bar
      :title="$t('route.phone')"
      fixed
      safe-area-inset-top
      placeholder
      @click-left="back"
    >
      <template #title>
        {{ current.title || $t(`phone.pages[${current.page}][0]`) }}
        <div id="title-english">
          {{ $t(`phone.pages[${current.page}][1]`) }}
        </div>
      </template>
      <template #left>
        <van-icon
          id="button-back"
          size="24"
          :name="require('@/assets/Phone/FBack.svg')"
        />
      </template>
    </van-nav-bar>

    <div id="page" style="width: 100%" />

    <van-tabbar
      v-show="current.page < 4"
      id="tabbar"
      v-model="active"
      active-color="#ef8d98"
      inactive-color="#858585"
      fixed
      safe-area-inset-bottom
      placeholder
      @change="openPage(active, undefined, true)"
    >
      <van-tabbar-item v-for="(v, i) in icons" :key="v">
        <template #icon="prop">
          <van-icon
            :name="require(`@/assets/Phone/${prop.active ? 'F' : 'O'}${v}.svg`)"
          />
        </template>
        <span v-t="`phone.tabbar[${i}]`" />
      </van-tabbar-item>
    </van-tabbar>
  </van-config-provider>

  <!-- #0 Messages 短信 -->
  <teleport to="#page" v-if="current.page == 0">
    <van-cell-group>
      <van-swipe-cell v-for="(id, index) in data.messages" :key="id">
        <phone-cell
          :name="data.contacts[id].name"
          :message="getRecentMessage(id)"
          :avatar="getAvatar(data.contacts[id].avatar)"
          :badge="data.contacts[id].badge"
          :top="data.contacts[id].top"
          @click="openPage(4, id)"
        />
        <template #right>
          <van-button
            class="button"
            square
            type="primary"
            :text="$t('phone.message.top')"
            @click="toggleTop(id, index)"
          />
          <van-button
            class="button"
            square
            type="warning"
            :text="$t('phone.message.hide')"
            @click="data.messages.splice(index, 1)"
          />
        </template>
      </van-swipe-cell>
    </van-cell-group>
  </teleport>

  <!-- #2 Video 视频 -->
  <teleport to="#page" v-else-if="current.page == 2">
    <van-cell-group :title="$t('phone.video.title')" inset>
      <van-cell
        :title="$t('phone.video.leave')"
        is-link
        clickable
        @click="leave"
      />
    </van-cell-group>
  </teleport>

  <!-- #3 Contacts 通讯录 -->
  <teleport to="#page" v-else-if="current.page == 3">
    <van-cell-group>
      <phone-cell
        :name="data.contacts[data.self].name"
        :avatar="getAvatar(data.contacts[data.self].avatar)"
        @click="openPage(8, data.self)"
      />
    </van-cell-group>
    <van-cell-group :title="$t('phone.contact.categories[0]')">
      <template v-for="(contact, id) in data.contacts" :key="contact">
        <phone-cell
          v-if="contact.special && id != data.self"
          :name="contact.name"
          :avatar="getAvatar(contact.avatar)"
          :level="contact.level"
          :progress="contact.progress"
          @click="openPage(8, id)"
        />
      </template>
    </van-cell-group>
    <van-cell-group :title="$t('phone.contact.categories[1]')">
      <template v-for="(contact, id) in data.contacts" :key="contact">
        <phone-cell
          v-if="!contact.special && id != data.self"
          :name="contact.name"
          :avatar="getAvatar(contact.avatar)"
          @click="openPage(8, id)"
        />
      </template>
    </van-cell-group>
  </teleport>

  <!-- #4 Messages 短信内容页-->
  <teleport to="#page" v-else-if="current.page == 4">
    <template
      v-for="message in data.contacts[current.id].messages"
      :key="message"
    >
      <message-bubble
        :data="message"
        :avatar="getAvatar(data.contacts[message.speaker].avatar)"
        :self="message.speaker == data.self"
      />
    </template>
  </teleport>

  <!-- #7 Avatar 头像设置页 -->
  <teleport to="#page" v-else-if="current.page == 7">
    <van-grid square>
      <van-grid-item
        v-for="avatar in avatars"
        :key="avatar"
        :badge="
          avatar == data.contacts[current.id].avatar
            ? $t('phone.contact.current')
            : undefined
        "
        :badge-props="{ color: '#ee8f97' }"
        @click="data.contacts[current.id].avatar = avatar"
      >
        <template #icon>
          <van-icon class="avatar" size="50px" :name="getAvatar(avatar)" />
        </template>
      </van-grid-item>
    </van-grid>
  </teleport>

  <!-- #8 Contacts 通讯录设置页 -->
  <teleport to="#page" v-else-if="current.page == 8">
    <van-cell-group title=" " inset>
      <van-cell
        :title="$t('phone.contact.avatar')"
        center
        clickable
        is-link
        @click="openPage(7, current.id)"
      >
        <template #value>
          <van-icon
            class="avatar"
            size="50px"
            :name="getAvatar(data.contacts[current.id].avatar)"
          />
        </template>
      </van-cell>
    </van-cell-group>
    <van-cell-group title=" " inset>
      <van-field
        v-model="data.contacts[current.id].name"
        :label="$t('phone.contact.name')"
      />
      <van-cell title="" :label="$t('phone.desc.mark')" />
    </van-cell-group>
    <van-cell-group v-if="current.id != data.self" title=" " inset>
      <van-cell :title="$t('phone.contact.special')" center>
        <template #right-icon>
          <van-switch v-model="data.contacts[current.id].special" />
        </template>
      </van-cell>
      <template v-if="data.contacts[current.id].special">
        <van-cell :title="$t('phone.contact.level')" center>
          <template #right-icon>
            <van-stepper
              v-model="data.contacts[current.id].level"
              v-bind="stepper"
            />
          </template>
        </van-cell>
        <van-cell :title="$t('phone.contact.progress')" center>
          <template #right-icon>
            <van-stepper
              v-model="data.contacts[current.id].progress"
              v-bind="stepper"
              max="100"
            />
          </template>
        </van-cell>
      </template>
    </van-cell-group>
    <van-cell-group v-if="current.id != data.self" title=" " inset>
      <van-cell :title="$t('phone.contact.add')" is-link clickable />
      <van-cell :title="$t('phone.contact.self')" is-link clickable />
      <van-cell :title="$t('phone.contact.clear')" is-link clickable />
      <van-cell :title="$t('phone.contact.delete')" is-link clickable />
    </van-cell-group>
  </teleport>

  <!-- WIP -->
  <teleport to="#page" v-else>
    <van-empty :description="$t('phone.wip')" />
  </teleport>
</template>

<script>
import {
  Empty,
  Grid,
  GridItem,
  NavBar,
  Tabbar,
  TabbarItem,
  SwipeCell,
  showDialog,
  showConfirmDialog,
} from 'vant'
import PhoneCell from '@/components/PhoneCell.vue'
import MessageBubble from '@/components/MessageBubble.vue'

export default {
  name: 'PhoneSimulator',
  components: {
    [Empty.name]: Empty,
    [Grid.name]: Grid,
    [GridItem.name]: GridItem,
    [NavBar.name]: NavBar,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [SwipeCell.name]: SwipeCell,
    PhoneCell,
    MessageBubble,
  },
  data() {
    return {
      active: 0,
      title: undefined,
      current: { page: 0 }, // { page, id, title }
      stack: [], // like breadcrumb
      data: {},
      icons: ['Message', 'Discover', 'Video', 'Contact'],
      avatars: require('@/data/avatars.json'),
      stepper: {
        integer: true,
        'input-width': '48px',
        min: 0,
      },
    }
  },
  computed: {
    theme() {
      return {
        navBarHeight: '69px',
        tabbarHeight: '60px',
        navBarTitleTextColor:
          this.$root.theme == 'dark' ? '#ffffff' : '#323233',
      }
    },
  },
  mounted() {
    this.setPresetData()
    window.onbeforeunload = function (e) {
      e = e || window.event
      if (e) {
        e.returnValue = '关闭提示'
      }
      return '关闭提示'
    }
  },
  unmounted() {
    window.onbeforeunload = null
  },
  methods: {
    back() {
      if (this.stack[this.stack.length - 1]?.page !== undefined)
        this.current = this.stack.pop()
      else
        showDialog({
          ...this.$root.dialogSettings,
          message: this.$t('phone.dialog.back'),
        })
    },
    leave() {
      showConfirmDialog({
        ...this.$root.dialogSettings,
        message: this.$t('phone.dialog.leave'),
      })
        .then(() => this.$router.back())
        .catch(() => {})
    },
    setPresetData() {
      let preset = require(`@/data/${this.$root.server}/phone.json`)
      this.data = JSON.parse(JSON.stringify(preset))
    },
    /**
     * @param {Number} page 页面 ID
     * @param {Number?} id 联系人 ID
     * @param {Boolean?} noHistory 是否加入历史
     */
    openPage(page, id, noHistory) {
      if (!noHistory) this.stack.push(this.current)
      this.current = {
        id,
        page,
        title: page == 7 ? undefined : this.data.contacts[id]?.name,
      }
    },
    onError() {
      showDialog({
        ...this.$root.dialogSettings,
        message: this.$t('phone.errorDesc'),
      })
      this.setPresetData()
    },
    getAvatar(name) {
      if (name.startsWith('data:')) return name
      return require(`@/assets/avatars/${name}.png`)
    },
    getRecentMessage(index) {
      try {
        let recentMessage = this.data.contacts[index]?.messages?.slice(-1)[0]
        return this.$t('phone.message.recentFormat', [
          this.$t(`phone.message.types[${recentMessage?.type || 0}]`),
          recentMessage?.content,
        ])
      } catch (e) {
        console.log(e)
        this.onError()
      }
    },
    /**
     * @param {Number} id 联系人 ID
     * @param {Number} index 联系人在短信页的索引
     */
    toggleTop(id, index) {
      if (this.data.contacts[id].top) {
        this.data.contacts[id].top = false
        this.data.messages.splice(index, 1)
        let topCount = 0
        for (let i in this.data.messages) {
          if (this.data.contacts[this.data.messages[i]].top) topCount += 1
        }
        let tops = this.data.messages.splice(0, topCount)
        this.data.messages = tops.concat([id], this.data.messages)
      } else {
        this.data.contacts[id].top = true
        this.data.messages.splice(index, 1)
        this.data.messages = [id].concat(this.data.messages)
      }
    },
  },
}
</script>

<style scoped>
@font-face {
  font-family: 'Northwell-Alt';
  src: url('~@/assets/fonts/Northwell_Alt.ttf');
}

.van-theme-dark #title-english,
.van-theme-dark #button-back {
  filter: invert(1);
}

#title-english {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 20px;
  padding-top: 49px;
  overflow-y: hidden;
  font-family: 'Northwell-Alt';
  font-size: 72px;
  font-weight: 400;
  letter-spacing: 5px;
  color: rgba(0, 0, 0, 0.1);
  z-index: -1;
  background-image: url('~@/assets/Phone/navbar.png');
  background-position: 0 100%;
  background-size: 100% auto;
  background-attachment: fixed;
}

.button {
  height: 100%;
}

.avatar {
  border-radius: 5px;
  overflow: hidden;
}
</style>
