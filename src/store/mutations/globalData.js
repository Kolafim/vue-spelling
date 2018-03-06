import * as types from '../constants/types'

export const globalDataMutations = {
    // [types.SET_USER] (state, action) {
    //     state.id = action.id;
    //     state.phone = action.phone;
    //     state.token = action.token;
    // },
    // 清除数据
    // ===============
    // [types.CLEAR_USER] (state) {
    //     state.id = 0;
    //     state.phone = '';
    //     state.token = '';
    // }
    [types.FETCH_PRICE_SUC] (state, action) {
        //state.isFetching = false;
        state.priceData = action.data.data
    },
    [types.FETCH_MESSAGE_SUC] (state, action) {
        //state.isFetching = false;
        state.message = action.data
    },
    [types.SHOW_PANEL_OVERFLOW](state) {
        state.isHideMainOverflow = true;
        state.animat = 1;
    },
    [types.HIDE_PANEL_OVERFLOW](state) {
        state.isHideMainOverflow = false;
        state.animat = 0;
    },
    [types.MESSAGE_HIDE_TRUE](state) {
        state.message.hide = 1;
    },
    [types.REG_RUN_TIME](state) {
        state.message = {
          hide:0,
          c:1,
          msg:'正在发送验证短信'
        };
        state.regTime = 50;
        state.regTimer = setInterval(()=>{
          let _rt = state.regTime - 1;
          if(_rt < 0){
            clearInterval(state.regTimer);
          }else{
            state.regTime = _rt;
          }
        },1000);
    },
    [types.HELP_SUCCESS](state) {
        state.help_success = 1;
    },
    [types.HELP_SUCCESS_INIT](state) {
        state.help_success = 0;
    }

}
