import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import i18n from '@/i18n'
// import '@/sass/overrides.sass'
import '@mdi/font/css/materialdesignicons.css'

Vue.use(Vuetify)

const theme = {
  primary: '#4CAF50',
  secondary: '#9C27b0',
  accent: '#9C27b0',
  info: '#00CAE3',
}
Vuetify.config.silent = true
export default new Vuetify({
  lang: {
    t: (key, ...params) => i18n.t(key, params),
  },
  theme: {
    themes: {
      dark: theme,
      light: theme,
    },
  },
  icons: {
    iconfont: 'mdi', // default - only for display purposes
  },
})
