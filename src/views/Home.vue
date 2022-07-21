<template>
  <navbar v-if="active != 'events'" :title="$t('app.title')" />
  <navbar v-else :title="$t('app.title')" hint="events" />

  <div class="home">
    <template v-if="active == 'events'">
      <events-block v-for="v in events" :key="v" :events="v" />
    </template>

    <template v-if="active == 'calculators'">
      <template v-for="(v, i) in tools" :key="v">
        <van-divider>{{ $t(`home.category[${i}]`) }}</van-divider>
        <div class="content">
          <van-button
            v-for="u in v"
            :key="u"
            block
            :to="u.to"
            :color="u.background"
            :style="u.color ? `color: ${u.color} !important;` : ''"
          >
            {{ $t(`route${u.to.replaceAll('/', '.')}`) }}
          </van-button>
        </div>
      </template>
    </template>

    <template v-if="active == 'settings'">
      <!-- Mirror -->
      <van-cell-group :title="$t('settings.mirror')" inset>
        <template v-for="v in mirrors" :key="v">
          <van-cell
            v-if="hostname != v.hostname"
            :title="`${v.name} ${$t('settings.mirror')}`"
            :url="v.url"
            is-link
          />
        </template>
        <van-cell title="" :label="$t('settings.mirrorDesc')" />
      </van-cell-group>

      <!-- Cache -->
      <van-cell-group :title="$t('settings.cache')" inset>
        <van-cell
          :title="$t('settings.clearLocalStorage')"
          @click="clearLocalStorage"
          is-link
          center
        />
        <van-cell title="" :label="$t('settings.clearCacheDesc')" />
      </van-cell-group>

      <!-- Appearance -->
      <van-cell-group :title="$t('settings.appearance')" inset>
        <van-cell
          :title="$t(`settings.appearances[${Number(appearance)}]`)"
          :label="$t('settings.appearanceDesc')"
          center
        >
          <template #right-icon>
            <van-switch v-model="appearance" />
          </template>
        </van-cell>
      </van-cell-group>

      <!-- About -->
      <van-cell-group :title="$t('settings.about')" inset>
        <van-cell :title="$t('settings.version')" :value="version" />
        <van-cell
          :title="$t('settings.addtohome')"
          is-link
          @click="showAddToHome = true"
        />
        <van-cell :title="$t('route.statement')" is-link to="/statement" />
        <van-cell :title="$t('route.changelog')" is-link to="/changelog" />
      </van-cell-group>

      <!-- Developer -->
      <van-cell-group
        v-if="$root.developerMode"
        :title="$t('settings.developer')"
        inset
      >
        <van-field
          v-model="langName"
          is-link
          readonly
          :label="$t('settings.lang')"
          @click="showLangPicker = true"
        />
        <van-field
          v-model="$root.server"
          is-link
          readonly
          :label="$t('settings.server')"
          @click="showServerPicker = true"
        />
        <van-cell :title="$t('settings.vConsole')" is-link center>
          <template #right-icon>
            <van-switch v-model="$root.vConsoleOpen" />
          </template>
        </van-cell>
      </van-cell-group>
    </template>
  </div>

  <van-tabbar
    fixed
    safe-area-inset-bottom
    placeholder
    v-model="active"
    @change="onActiveChange"
  >
    <van-tabbar-item name="events" icon="calendar-o">
      {{ $t('home.tabbar.events') }}
    </van-tabbar-item>
    <van-tabbar-item name="calculators" icon="apps-o">
      {{ $t('home.tabbar.calculators') }}
    </van-tabbar-item>
    <van-tabbar-item name="settings" icon="setting-o">
      {{ $t('home.tabbar.settings') }}
    </van-tabbar-item>
  </van-tabbar>

  <van-popup
    v-model:show="showLangPicker"
    round
    position="bottom"
    safe-area-inset-bottom
  >
    <van-picker
      :columns="langs"
      @cancel="showLangPicker = false"
      @confirm="onLangConfirm"
    />
  </van-popup>

  <van-popup
    v-model:show="showServerPicker"
    round
    position="bottom"
    safe-area-inset-bottom
  >
    <van-picker
      :columns="servers"
      @cancel="showServerPicker = false"
      @confirm="onServerConfirm"
    />
  </van-popup>

  <van-popup
    v-model:show="showAddToHome"
    round
    position="bottom"
    :style="{ height: '40%' }"
    safe-area-inset-bottom
  >
    <div class="content">
      <h3 v-t="'settings.addtohome'" />
      <p v-t="'settings.addtohomeDesc'" />
      <van-tabs v-model:active="isIos" type="card">
        <van-tab title="Android">
          <i18n-t keypath="settings.addtohomeAndroid" scope="global" tag="p">
            <van-icon name="ellipsis" id="a2h-android-icon" />
          </i18n-t>
        </van-tab>
        <van-tab title="iOS">
          <i18n-t keypath="settings.addtohomeIos" scope="global" tag="p">
            <template #share><share-ios height="14" :fill="fill" /></template>
            <template #add><add-ios height="14" :fill="fill" /></template>
          </i18n-t>
        </van-tab>
      </van-tabs>
    </div>
  </van-popup>
</template>

<script>
import { showDialog, showToast, Tabbar, TabbarItem, Tag } from 'vant'
import Navbar from '@/components/Navbar.vue'
import EventsBlock from '@/components/EventsBlock.vue'
import ShareIos from '@/icons/ShareIos.vue'
import AddIos from '@/icons/AddIos.vue'

export default {
  name: 'App',
  components: {
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    [Tag.name]: Tag,
    Navbar,
    EventsBlock,
    ShareIos,
    AddIos,
  },
  data() {
    let dayjs = require('dayjs')
    return {
      events: require(`@/data/${this.$root.server}/events.json`),
      tools: [
        [
          {
            background: 'linear-gradient(135deg, #91c4cc, #b7ddc0)',
            to: '/gacha',
          },
          {
            background: 'linear-gradient(135deg, #6c71c5, #93a9da)',
            to: '/wishsim',
          },
        ],
        [
          {
            background: 'linear-gradient(135deg, #bbe0f5, #e0f8e0)',
            color: 'rgba(69, 90, 100, .8)',
            to: '/hoard',
          },
          {
            background: 'linear-gradient(135deg, #fbe9c3, #e6d8be)',
            color: 'rgba(85, 76, 60, .8)',
            to: '/cpr',
          },
          {
            background: 'linear-gradient(135deg, #fbe4e2, #f3b0a6)',
            color: 'rgba(109, 46, 43, 0.8)',
            to: '/level',
          },
          {
            background: 'linear-gradient(135deg, #f3d7d3, #c4c7e8)',
            color: 'rgba(78, 68, 91, 0.8)',
            to: '/item',
          },
        ],
        [
          {
            background: 'linear-gradient(135deg, #6c71c5, #93a9da)',
            to: '/wish',
          },
        ],
      ],
      mirrors: [
        {
          name: 'GitHub Pages',
          hostname: 'waterv.github.io',
          url: 'https://waterv.github.io/lightandnight',
        },
        {
          name: 'Vercel',
          hostname: 'lightandnight.vercel.app',
          url: 'https://lightandnight.vercel.app',
        },
      ],
      langs: [{ text: '简体中文', value: 'zh-CN' }],
      servers: [{ text: 'CN', value: 'CN' }],
      langName_: undefined,
      showLangPicker: false,
      showServerPicker: false,
      showAddToHome: false,
      isIos: Number(
        !!navigator?.userAgent?.match(
          /ip[honead]{2,4}\b(?:.*os ([\w]+) like mac|; opera)/i
        )
      ), // Copied from faisalman/ua-parser-js
      active: this.$root.homepageActive,
      hostname: window.location.hostname,
      version: dayjs(require('@/data/app/time.json').time).format(
        'YYYY-MM-DD HH:mm:ss'
      ),
    }
  },
  computed: {
    appearance: {
      get() {
        return this.$root.theme == 'dark'
      },
      set(v) {
        this.$root.theme = v ? 'dark' : ''
      },
    },
    lang: {
      get() {
        return localStorage?.getItem('lang') || 'zh-CN'
      },
      set(v) {
        localStorage?.setItem('lang', v)
        this.$i18n.locale = v
      },
    },
    langName: {
      get() {
        return this.langName_ || localStorage?.getItem('langName') || '简体中文'
      },
      set(v) {
        this.langName_ = v
        localStorage?.setItem('langName', v)
      },
    },
    fill() {
      return this.$root.theme == 'dark'
        ? 'rgba(255, 255, 255, 0.75)'
        : '#323233'
    },
  },
  mounted() {
    let userVersion = localStorage?.getItem('version') || 0
    let { version, message } = require('@/data/app/announce.json')
    if (userVersion < version) {
      showDialog({
        ...this.$root.dialogSettings,
        title: this.$t('common.announce'),
        message,
      }).then(() => {
        localStorage?.setItem('version', version)
      })
    }
  },
  methods: {
    onActiveChange(active) {
      this.$root.homepageActive = active
    },
    clearLocalStorage() {
      localStorage?.clear()
      showToast({
        message: this.$t('settings.clearLocalStorageToast'),
        icon: 'passed',
      })
    },
    onLangConfirm({ selectedOptions }) {
      this.showLangPicker = false
      this.langName = selectedOptions[0].text
      this.lang = selectedOptions[0].value
    },
    onServerConfirm({ selectedOptions }) {
      this.showServerPicker = false
      this.$root.server = selectedOptions[0].value
    },
  },
}
</script>

<style scoped>
.home {
  padding-bottom: 54px;
}

.van-theme-dark .block {
  filter: brightness(0.8);
}

.van-button {
  margin: 5px 0;
}

.van-theme-dark .van-button {
  filter: brightness(0.8);
}

#a2h-android-icon {
  transform: rotate(90deg);
}
</style>
