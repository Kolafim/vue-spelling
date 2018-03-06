import { globalDataMutations } from '../mutations/globalData'
import { globalDataActions } from '../actions/globalData'
import {globalDataGetters} from '../getters/globalData'
const globalData = {
    state: {
      isHideMainOverflow:false,
      priceData:{
        timestamp:-1
      },
      message:{
        hide:1,
        c:0,
        msg:''
      },
      animat:0,
      regTime:0,
      regTimer:0,
      help_success:0,
      imghost:'imghost1',
      localimg:'images/' //静态资源
    },
    mutations: globalDataMutations,
    actions: globalDataActions,
    getters: globalDataGetters
}

export default globalData
