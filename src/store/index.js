import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import user_info from './modules/user_info'
import globalData from './modules/globalData'
import topics from './modules/topics'
import info from './modules/info'
import login from './modules/login'
import message from './modules/message'
import release from './modules/release'
import common from './modules/common'
import newStore from './modules/newStore'

const store = new Vuex.Store({
    modules: {
        topics,
        info,
        login,
        message,
        release,
        common,
        newStore,
        user_info,
        globalData,
        tool:{
          state:{
            initAvatar:function(_url){
              return _url.replace(/^\/\/(.+)/,'http://$1');
            }
          }
        }
    }
})

export default store
