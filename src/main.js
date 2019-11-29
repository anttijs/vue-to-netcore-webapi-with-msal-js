import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faEdit) 
library.add(faTrash)
library.add(faPlus)
Vue.component('font-awesome-icon', FontAwesomeIcon)
import Toasted from 'vue-toasted'
var toastOptions = {
  action : {
      text : 'Close',
      onClick : (e, toastObject) => {
          toastObject.goAway(0);
      }
  },
  position: 'top-center',
  type: 'info',
  theme: 'outline',
  duration: 4000
}
Vue.use(Toasted, toastOptions)

import AuthService from '@/msal/index'
Vue.prototype.$AuthService = new AuthService()

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
