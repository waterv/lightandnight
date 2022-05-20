import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@vant/touch-emulator'
import { NavBar, Col, Row, Divider, Cell, CellGroup, Popup, Dialog, Image as VanImage } from 'vant'
import { Button, Field, Stepper, Switch, Checkbox, CheckboxGroup, Radio, RadioGroup, Calendar, Picker } from 'vant'
import { NoticeBar, Tab, Tabs } from 'vant'
import { ConfigProvider } from 'vant'

let dayjs = require('dayjs')
require('dayjs/locale/zh-cn')
dayjs.locale('zh-cn')
var utc = require('dayjs/plugin/utc')
var timezone = require('dayjs/plugin/timezone')
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Shanghai')

const app = createApp(App)

app.use(router)

app
  .use(NavBar).use(Col).use(Row).use(Divider).use(Cell).use(CellGroup).use(Popup).use(Dialog).use(VanImage)
  .use(Button).use(Field).use(Stepper).use(Switch).use(Checkbox).use(CheckboxGroup).use(Radio).use(RadioGroup).use(Calendar).use(Picker)
  .use(NoticeBar).use(Tab).use(Tabs)
  .use(ConfigProvider)

app.mount('#app')
