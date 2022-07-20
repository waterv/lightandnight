import { createApp } from 'vue'
import router from './router'
import i18n from './i18n'
import App from './App.vue'
import './registerServiceWorker'
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
import 'vant/es/toast/style'
import 'vant/es/dialog/style'
import 'vant/es/notify/style'

// day.js configures
let dayjs = require('dayjs')

let utc = require('dayjs/plugin/utc')
dayjs.extend(utc)

let timezone = require('dayjs/plugin/timezone')
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Shanghai')

const app = createApp(App)
app
  .use(i18n)
  .use(router)
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
