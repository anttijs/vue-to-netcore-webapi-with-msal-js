import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiIndex: 0,
    loggedIn: false
  },
  mutations: {
    setApiIndex(state, apiIndex) {
      state.apiIndex = apiIndex
    },
    setLoggedIn(state, loggedIn) {
      state.loggedIn = loggedIn
    }
  },
  actions: {

  },
  modules: {

  }
})
