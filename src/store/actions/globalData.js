import * as types from '../constants/types'
import axios from 'axios'

export const globalDataActions = {
    /**
     * 请求指定团数据
     */
    fetchIndexAction({ commit, state }, params) {
        //let isRefresh = params.isRefresh || false;

        // if (!isRefresh) {
        //     commit(types.FETCH_TOPICS_REQ);
        // } else {
        //     commit(types.SHOW_REFRESH);
        // };
        //console.log(params);
        axios({
            method: 'POST',
            url: '/bigprice/getListBigPrice.dtzn',
            data: {
              uid: params.uid,
              prizeid: params.prizeid
            },
            transformRequest: [function (data) {
              // Do whatever you want to transform the data
              let ret = ''
              for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
              }
              return ret.replace(/\&$/,'');
            }],
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((res) => {
            let data = res.data;

            console.log(data);
            commit(types.FETCH_PRICE_SUC, {
                data: data
            });

            if('function' == typeof params.callback) params.callback.call();

            // 累加数组
            // arr = origin.concat(data);
            //
            // commit(types.HIDE_REFRESH);
            //
            // if (data.length > 0) {
            //     commit(types.FETCH_TOPICS_SUC, {
            //         data: arr
            //     })
            // } else {
            //     commit(types.TOGGLE_NO_MORE_DATA_STATE);
            //     commit(types.TOGGLE_ISFETCHING_STATE);
            // }
        }).catch((error) => {
            // commit(types.TOGGLE_ERROR_DATA_STATE);
            // commit(types.FETCH_TOPICS_ERR, {
            //     error
            // });
            console.log(error)
        })
    },
    /**
     * 请求验证
     */
    fetchRegPhoneAction({ commit, state }, params) {
      let _phone = params.phoneNum;
      if(!_phone){
        //if('function' == typeof params.fail) params.fail.call(this,{c:0,msg:'请填写手机号'});
        commit(types.FETCH_MESSAGE_SUC, {
            data: {hide:0,c:0,msg:'请填写手机号'}
        });
        return;
      }
      if (!_phone.match(/^(((17[0-9]{1})|(13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/)) {
        //if('function' == typeof params.fail) params.fail.call(this,{c:0,msg:'手机号格式错误'});
        commit(types.FETCH_MESSAGE_SUC, {
            data: {hide:0,c:0,msg:'手机号格式错误'}
        });
        return;
      }

      commit(types.REG_RUN_TIME, {});

      axios({
          method: 'POST',
          url: '/hello/sendSms.dtzn',
          data: {
            phoneNum: _phone
          },
          transformRequest: [function (data) {
            // Do whatever you want to transform the data
            let ret = ''
            for (let it in data) {
              ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
            }
            return ret.replace(/\&$/,'');
          }],
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
      }).then((res) => {
          let data = res.data;

          console.log(data);
          if(!res.data.resuld == 200){
            commit(types.FETCH_MESSAGE_SUC, {
                data: {hide:0,c:2,msg:res.data.msg}
            });
          }

          if('function' == typeof params.callback) params.callback.call();
      }).catch((error) => {
          // commit(types.TOGGLE_ERROR_DATA_STATE);
          // commit(types.FETCH_TOPICS_ERR, {
          //     error
          // });
          commit(types.FETCH_MESSAGE_SUC, {
              data: {hide:0,c:0,msg:error.message}
          });
          console.log(error)
      })
    },
    /**
     * 请求助力
     */
    fetchHelpAction({ commit, state }, params) {
        //console.log(params);
        let _phone = params.phonenum;
        if(!_phone){
          //if('function' == typeof params.fail) params.fail.call(this,{c:0,msg:'请填写手机号'});
          commit(types.FETCH_MESSAGE_SUC, {
              data: {hide:0,c:0,msg:'请填写手机号'}
          });
          return;
        }
        if (!_phone.match(/^(((17[0-9]{1})|(13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/)) {
          //if('function' == typeof params.fail) params.fail.call(this,{c:0,msg:'手机号格式错误'});
          commit(types.FETCH_MESSAGE_SUC, {
              data: {hide:0,c:0,msg:'手机号格式错误'}
          });
          return;
        }
        if(!params.smscode){
          //if('function' == typeof params.fail) params.fail.call(this,{c:0,msg:'请填写手机号'});
          commit(types.FETCH_MESSAGE_SUC, {
              data: {hide:0,c:0,msg:'请填写验证码'}
          });
          return;
        }
        axios({
            method: 'POST',
            url: '/bigprice/helpUser.dtzn',
            data: {
              phonenum: _phone,
              uname:params.uname,
              prizeid: params.prizeid,
              smscode: params.smscode
            },
            transformRequest: [function (data) {
              // Do whatever you want to transform the data
              let ret = ''
              for (let it in data) {
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
              }
              return ret.replace(/\&$/,'');
            }],
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then((res) => {
            let data = res.data;
            console.log(data);

            if(data.result == 419){
              commit(types.FETCH_MESSAGE_SUC, {
                  data: {hide:0,c:0,msg:'此号已无助力次数'}
              });
            }else if(data.result == 200){

              console.log("助力成功");

              commit(types.HELP_SUCCESS, {});

              //app.setHelpUserPhone(_p.data.signup_phone || app.helpUserData.tempPhone);
            }else{
              commit(types.FETCH_MESSAGE_SUC, {
                  data: {hide:0,c:0,msg:(data.msg || '验证出错')}
              });
            }
            if('function' == typeof params.callback) params.callback.call();
        }).catch((error) => {
            // commit(types.TOGGLE_ERROR_DATA_STATE);
            // commit(types.FETCH_TOPICS_ERR, {
            //     error
            // });
            commit(types.FETCH_MESSAGE_SUC, {
                data: {hide:0,c:0,msg:error.message}
            });
            console.log(error)
        })
    }
}
