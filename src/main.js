import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'
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
  Divider
} from 'vant'

Vue.use(PullRefresh)
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
  }
})
new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
