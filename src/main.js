import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
import hljs from 'highlight.js'
import 'highlight.js/styles/default.css'
import {
  NavBar,
  Form,
  Field,
  Button,
  Tabbar,
  TabbarItem,
  Icon,
  Tab,
  Tabs,
  Cell,
  List,
  PullRefresh,
  ActionSheet,
  Popup,
  Row,
  Col,
  Badge,
  Search,
  Divider,
  ShareSheet,
  Tag,
  CellGroup,
  Image,
  Dialog,
  DatetimePicker,
  Loading,
  Lazyload
} from 'vant'

// 注册时可以配置额外的选项
Vue.use(Lazyload, {
  preLoad: 0.8, // 0-1,屏幕可是区域百分比
  lazyComponent: true,
  error:
    'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.zcool.cn%2Fcommunity%2F01c45e56f3f8ad32f875a944345d69.jpg%402o.jpg&refer=http%3A%2F%2Fimg.zcool.cn&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1666495929&t=f62184a76e43894e83b5239198a3b6ae'
})
Vue.use(PullRefresh)
Vue.use(Loading)
Vue.use(DatetimePicker)
Vue.use(Dialog)
Vue.use(Image)
Vue.use(CellGroup)
Vue.use(Tag)
Vue.use(Divider)
Vue.use(Search)
Vue.use(Row)
Vue.use(Col)
Vue.use(Badge)
Vue.use(Popup)
Vue.use(ActionSheet)
Vue.use(List)
Vue.use(Cell)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Icon)

Vue.use(Tabbar)
Vue.use(TabbarItem)
Vue.use(Form)
Vue.use(Field)
Vue.use(NavBar)
Vue.use(Button)
Vue.use(ShareSheet)

Vue.config.productionTip = false
Vue.directive('focus', {
  inserted(el) {
    if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
      el.focus()
    } else {
      const theInput = el.querySelector('input')
      const theTextarea = el.querySelector('textarea')
      if (theInput) theInput.focus()
      if (theTextarea) theTextarea.focus()
    }
  },
  update(el) {
    if (el.nodeName === 'TEXTAREA' || el.nodeName === 'INPUT') {
      el.focus()
    } else {
      const theInput = el.querySelector('input')
      const theTextarea = el.querySelector('textarea')
      if (theInput) theInput.focus()
      if (theTextarea) theTextarea.focus()
    }
  }
})
Vue.directive('highlight', function (el) {
  // 自定义一个代码高亮指令
  const highlight = el.querySelectorAll('pre, code') // 获取里面所有pre或者code标签
  highlight.forEach((block) => {
    hljs.highlightElement(block) // 突出显示这些标签(以及内部代码, 会自动识别语言)
  })
})
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
