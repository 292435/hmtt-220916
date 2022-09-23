import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userPhoto:
      'https://img1.baidu.com/it/u=1280020419,4216694913&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=667',
    userName: '11111'
  },
  getters: {},
  mutations: {
    USER_PHOTO(state, value) {
      state.userPhoto = value
    },
    USER_NAME(state, value) {
      state.userName = value
    }
  },
  actions: {},
  modules: {}
})
