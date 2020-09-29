import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    apiIndex: 0
  },
  mutations: {
    setApiIndex(state, apiIndex) {
      state.apiIndex = apiIndex
    }
  },
  actions: {

  },
  modules: {

  }
})
