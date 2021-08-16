
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/base'
import './plugins/chartist'
import './plugins/vee-validate'
import vuetify from './plugins/vuetify'
import i18n from './i18n'
import axios from 'axios'

Vue.config.productionTip = false

const base = axios.create({
  baseURL: process.env.VUE_APP_API,
})
Vue.prototype.$axios = base

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App),
}).$mount('#app')
