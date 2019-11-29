import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    ctx: { page: 2 }, msg: 'moi', msg2: 'aappa', pricing: {unitPrice: 0, quantity: 0}, id: -1, apiIndex: 0, loggedIn: false
  },
  mutations: {
    setCtx(state, page) {
      state.ctx.page = page 
    },
    setPricing(state, pricing) {
      state.pricing = pricing
    },
    setId(state, id) {
      state.id = id
    },
    setApiIndex(state, apiIndex) {
      console.log('store.setApiIndex', apiIndex)
      state.apiIndex = apiIndex
    },
    setLoggedIn(state, loggedIn) {
      console.log('store.setLoggedIn', loggedIn)
      state.loggedIn = loggedIn
    }
  },
  actions: {

  },
  modules: {

  }
})
