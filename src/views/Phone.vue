<template>
  <van-config-provider :theme-vars="theme">
    <van-nav-bar
      id="navbar"
      :title="$t('route.phone')"
      fixed
      safe-area-inset-top
      placeholder
      @click-left="back"
    >
      <template #title>
        {{ $t(`phone.pages[${currentPage}][0]`) }}
        <div id="title-english">
          {{ $t(`phone.pages[${currentPage}][1]`) }}
        </div>
      </template>
      <template #left>
        <van-icon size="24" :name="require('@/assets/Phone/FBack.svg')" />
      </template>
    </van-nav-bar>

    <van-empty :description="$t('phone.wip')" />

    <van-tabbar
      id="tabbar"
      v-model="active"
      active-color="#ef8d98"
      inactive-color="#858585"
      fixed
      safe-area-inset-bottom
      placeholder
      @change="openPage"
    >
      <van-tabbar-item v-for="(v, i) in icons" :key="v">
        <span v-t="`phone.tabbar[${i}]`" />
        <template #icon="prop">
          <van-icon
            :name="require(`@/assets/Phone/${prop.active ? 'F' : 'O'}${v}.svg`)"
          />
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </van-config-provider>
</template>

<script>
import { Empty, NavBar, Tabbar, TabbarItem, showConfirmDialog } from 'vant'

export default {
  name: 'PhoneSimulator',
  components: {
    [Empty.name]: Empty,
    [NavBar.name]: NavBar,
    [Tabbar.name]: Tabbar,
    [TabbarItem.name]: TabbarItem,
  },
  data() {
    return {
      active: 0,
      currentPage: 0,
      icons: ['Message', 'Discover', 'Video', 'Contact'],
      theme: {
        navBarBackground: 'transparent',
        navBarHeight: '69px',
        navBarTitleTextColor: '#000000',
        navBarTextColor: '#000000',
        navBarIconColor: '#000000',
        tabbarHeight: '60px',
      },
    }
  },
  methods: {
    back() {
      showConfirmDialog({
        ...this.$root.dialogSettings,
        message: this.$t('phone.backDesc'),
      })
        .then(() => {
          this.$router.back()
        })
        .catch(() => {})
    },
    openPage(index) {
      this.currentPage = index
    },
  },
}
</script>

<style scoped>
@font-face {
  font-family: 'Northwell-Alt';
  src: url('~@/assets/fonts/Northwell_Alt.ttf');
}

#navbar {
  background-image: url('~@/assets/Phone/navbar.png');
  background-position: 0 100%;
  background-size: 100% auto;
  overflow-y: hidden;
}

.van-theme-dark #navbar {
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
}
</style>
