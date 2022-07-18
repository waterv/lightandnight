<template>
  <navbar v-if="active != 'events'" :title="$t('app.title')" />
  <navbar v-else :title="$t('app.title')" hint="events" />

  <div class="home">
    <template v-if="active == 'events'">
      <template v-for="v in events" :key="v"><!-- Category -->
        <van-cell-group v-if="!v.noavailable" :title="v.name" inset>

          <template v-for="u in v.events" :key="u"><!-- Event -->
            <van-cell v-if="u.time !== undefined" :title="u.name" :label="u.desc" center>

              <template #right-icon>
                <van-count-down :time="u.time">
                  <template #default="timeData">
                    <span class="block" :style="{ backgroundColor: u.color }">
                      {{ timeData.days }}
                    </span><small>d</small>
                    <span class="block" :style="{ backgroundColor: u.color }">
                      {{ timeData.hours }}
                    </span><small>h {{ u.state }}</small>
                  </template>
                </van-count-down>
              </template>

            </van-cell>
          </template>

        </van-cell-group>
      </template>
    </template>

    <template v-if="active == 'calculators'">
      <template v-for="(v, i) in tools" :key="v"><!-- Category -->
        <van-divider>{{ $t(`home.category[${i}]`) }}</van-divider>

        <div class="content"><!-- Tool -->
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
      <!-- Mirrors -->
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

      <van-cell-group title=" " inset>
        <van-cell
          :title="$t('settings.appearance', [$t(`settings.appearances[${Number(appearance)}]`)])"
          :label="$t('settings.appearanceDesc')"
          center
        >
          <template #right-icon>
            <van-switch v-model="appearance" />
          </template>
        </van-cell>
        <!-- <van-field
          v-model="langName"
          is-link
          readonly
          :label="$t('settings.lang')"
          @click="showLangPicker = true"
        /> --><!-- 预留 -->
      </van-cell-group>

      <van-cell-group title=" " inset>
        <van-cell :title="$t('route.posts.addtohome')" is-link to="/posts/addtohome" />
        <van-cell :title="$t('route.posts.statement')" is-link to="/posts/statement" />
        <van-cell :title="$t('route.posts.changelog')" is-link to="/posts/changelog" />
      </van-cell-group>
    </template>
  </div>

  <van-tabbar fixed safe-area-inset-bottom v-model="active" @change="onActiveChange">
    <van-tabbar-item name="events" icon="calendar-o">{{ $t('home.tabbar.events') }}</van-tabbar-item>
    <van-tabbar-item name="calculators" icon="apps-o">{{ $t('home.tabbar.calculators') }}</van-tabbar-item>
    <van-tabbar-item name="settings" icon="setting-o">{{ $t('home.tabbar.settings') }}</van-tabbar-item>
  </van-tabbar>

  <van-popup v-model:show="showLangPicker" round position="bottom">
    <van-picker
      :columns="langs"
      @cancel="showLangPicker = false"
      @confirm="onLangConfirm"
    />
  </van-popup>
</template>

<script>
import { CountDown, Tabbar, TabbarItem, Toast } from 'vant'
import Navbar from '@/components/Navbar.vue'
let dayjs = require('dayjs')

export default {
  name: 'App',
  components: {
    [CountDown.name]: CountDown,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
    Navbar,
  },
  data() {
    // Process events data
    let events = require('@/assets/data/events.json')
    let now = dayjs()
    for (let i in events) {
      let count = 0
      for (let j in events[i].events) {
        let v = events[i].events[j]
        if (v.periodic) {
          count += 1
          let target = dayjs().tz().day(v.day).hour(0).minute(0).second(0).millisecond(0)

          if (v.state == '始') target = target.hour(5)
          if (now.day() >= v.day) target = target.add(1, 'week')
          v.time = target.diff(now)
          v.color = v.state == '止' && v.time <= 86400000 ? 'var(--van-red)' : 'var(--van-gray-7)'
        } else {
          let start = dayjs.tz(v.start)
          if (now.isBefore(start)) {
            count += 1
            v.time = start.diff(now)
            v.state = '始'
            v.color = 'var(--van-blue)'
          } else {
            let end = dayjs.tz(v.end)
            if (now.isBefore(end)) {
              count += 1
              v.time = end.diff(now)
              v.state = '止'
              v.color = v.time <= 86400000 ? 'var(--van-red)' : 'var(--van-green)'
            }
          }
        }
      }
      if (count == 0) events[i].noavailable = true
    }

    return {
      active: this.$root.homepageActive,
      hostname: window.location.hostname,
      showLangPicker: false,      
      events,
      tools: require('@/assets/data/tools.json'),
      mirrors: require('@/assets/data/mirrors.json'),
      langs: require('@/assets/data/langs.json'),
      langName_: undefined,
    }
  },
  computed: {
    appearance: {
      get() {
        return this.$root.theme == 'dark'
      },
      set(v) {
        this.$root.theme = v ? 'dark' : ''
      }
    },
    lang: {
      get() {
        return localStorage.getItem('lang') || 'zh-CN'
      },
      set(v) {
        localStorage.setItem('lang', v)
        this.$i18n.locale = v
      }
    },
    langName: {
      get() {
        return this.langName_ || localStorage.getItem('langName') || '简体中文'
      },
      set(v) {
        this.langName_ = v
        localStorage.setItem('langName', v)
      }
    },
  },
  methods: {
    onActiveChange(active) {
      this.$root.homepageActive = active
    },
    clearLocalStorage() {
      localStorage.clear()
      Toast({
        message: this.$t('settings.clearLocalStorageToast'),
        icon: 'passed'
      })
    },
    onLangConfirm({ selectedOptions }) {
      this.showLangPicker = false
      this.langName = selectedOptions[0].text
      this.lang = selectedOptions[0].value
    },
  },
}
</script>

<style scoped>
.home {
  padding-bottom: 54px;
}

.block {
  display: inline-block;
  width: 22px;
  margin: 0 2px;
  color: white;
  font-size: 12px;
  text-align: center;
  border-radius: 4px;
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
</style>
