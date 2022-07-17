import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@vant/touch-emulator'

import {
  Col,
  Row,
  Divider,
  Cell,
  CellGroup,
  Popup,
  Dialog,
  Image as VanImage,
  Icon,
  Button,
  Field,
  Stepper,
  Switch,
  Checkbox,
  CheckboxGroup,
  Radio,
  RadioGroup,
  Calendar,
  Picker,
  NoticeBar,
  Tab,
  Tabs,
  ConfigProvider,
} from 'vant'

import './registerServiceWorker'

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
  .use(Col)
  .use(Row)
  .use(Divider)
  .use(Cell)
  .use(CellGroup)
  .use(Popup)
  .use(Dialog)
  .use(VanImage)
  .use(Icon)
  .use(Button)
  .use(Field)
  .use(Stepper)
  .use(Switch)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Radio)
  .use(RadioGroup)
  .use(Calendar)
  .use(Picker)
  .use(NoticeBar)
  .use(Tab)
  .use(Tabs)
  .use(ConfigProvider)

app.mount('#app')
