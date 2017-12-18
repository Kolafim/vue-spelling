// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

// axios
import axios from 'axios'
axios.defaults.baseURL = 'http://192.168.8.239'   // base url
//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

// import css
import './assets/css/material-icons.css'     // material-icons.css
import './assets/css/reset.css'              // reset.css
import './assets/css/color.css'
import './assets/css/common.css'
// import 'animate.css'                         // animate.css

// muse
// import MuseUI from 'muse-ui'
// import 'muse-ui/dist/muse-ui.css'
// import 'muse-ui/dist/theme-teal.css'
// Vue.use(MuseUI)

import store from './store/index'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
})
