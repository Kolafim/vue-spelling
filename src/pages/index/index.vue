<template>
    <div class="index-panel">
      <div class="container">
        <div class="head textcenter">
          <div class="top-banner loadimg-default" style="background-image:url(../../../static/image/banner.png)">
            <a :href="'#/message'">
              <img class="t-b-right-btn" src="../../../static/image/banner_right_btn.png"></img>
            </a>
          </div>
          <div v-if="reTimeData.mode != 1" class="head-text-cell">
            <div class="head-text-view">
              <span :class="reTimeData.mode==2?'orange':'red'">{{reTimeData.msg}}</span>
            </div>
          </div>
          <div v-else class="head-text-cell">
            <div class="head-text-view">
              <span class="text-spacing">距离周六开奖还有：</span>
              <div v-if="reTimeData.d >= 1" class="inline-block"><span class="time-num">{{reTimeData.d}}</span><span> 天</span></div>
              <div v-else class="inline-block">
                <span class="time-num time-h">{{reTimeData.h}}</span>
                <span> 小时 </span>
                <span class="time-num time-min">{{reTimeData.m}}</span>
                <span> 分 </span>
                <span class="time-num time-s">{{reTimeData.s}}</span>
                <span> 秒</span>
              </div>
            </div>
          </div>
        </div>
        <div class="main textcenter">
          <div class="main-content">
            <div class="m-top-count textright">
              <div class="users-count"><span class="middle">{{user_state.team_progress}}/5 邀请进度</span></div>
            </div>
            <div class="user-list flex-line">
              <div v-for="(users_item,users_index) in [0,1,2,3,4]" class="user-item">
                <div class="user-pic">
                  <img v-if="user_state.member[users_item]" @click="users_index>0 ? 'joinSpell':''" class="user-avatar" :src="this.globalData.imghost+user_state.member[users_item].helpheadimg"></img>
                  <img v-else @click="joinSpell" class="user-avatar" :src="'../../../static/image/user_type_bg_'+users_index+'.png'"></img>
                  <img v-if="users_index == 0" class="users-main-text" src="../../../static/image/users_main_text.png"></img>
                </div>
                <img class="user-type-icon" :src="'../../../static/image/user_type_default_'+users_index+'.png'"></img>
              </div>
            </div>
            <div class="main-btn">
              <template v-if="user_state.ismain && user_state.team_progress<5">
                <button  class="btn-main" open-type="share" >立即去邀请</button>
              </template>
              <template v-if="user_state.ismain && user_state.team_progress>=5">
                <button class="btn-main" @click='exchange' >兑换一注，继续开团</button>
              </template>
              <template v-if="user_state.team_progress<5 && !user_state.ismain">
                <button class="btn-main" @click="joinSpell">立即帮好友助力</button>
              </template>
               <template v-if="user_state.team_progress>=5 && !user_state.ismain">
                <button class="display btn-main" >本团已满</button>
              </template>

            </div>

            <div class="image-list">
              <img class="arrow-icon" src="../../../static/image/arrow_default.png"></img>
              <div class="lottery-cell" v-if="user_state.prize" >
                <div v-if="lotteryData" class="lottery-item">
                  <div class="l-i-head flex-line flex2">
                    <div class="l-i-h-id"><span>{{lotteryData.issueno}}</span>期</div>
                    <div class="l-i-h-right">已获得</div>
                  </div>
                  <div class="l-i-main">
                    <div class="l-i-m-num-list flex">
                      <div class="l-i-m-num-list-left">
                        <img v-for="(numitem_a,idx2) in lotteryData.new_number"
                          class="l-i-m-num-item"
                          src="../../../static/image/ball_red.png" ><span>{{numitem_a}}</span></img>
                      </div>
                      <div class="l-i-m-num-list-right">
                        <img v-for="(numitem_b,idx3) in lotteryData.new_refernumber"
                          class="l-i-m-num-item"
                          src="../../../static/image/ball_blue.png" ><span>{{numitem_b}}</span></img>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <img v-else @click="(user_state.gid==options.pgid  && user_state.team_progress==4 || !options.pgid && user_state.team_progress==4) ?'exchange':''" src="../../../static/image/daletou.png"></img>
              <img class="arrow-icon" src="../../../static/image/arrow_default.png"></img>
              <img @click='download' src="../../../static/image/downloadapp.png"></img>
            </div>
          </div>
        </div>
        <div class="foot">

        </div>
      </div>
    </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import { setCookie, getCookie, delCookie } from '../../assets/js/cookies'
import ReTime from '../../assets/js/ReTime'

// import snackbar from '../../components/snackbar/snackbar'
// import mainProgress from '../../components/mainProgress/mainProgress'
export default {
    data () {
        return {
            // ----- accesstoken
            accesstoken: '',
            // ----- tip
            isTipShow: false,
            // locationSearch:'',
            reTimeData:{},
            options:{
              mid:'',
              phone:'',
              pgid:''
            },
            user_state:{
              gid:null,//个人团id
              ismain:0,
              login_state: false,// 注册状态  false：未登录，true：已登陆

              open_state: '',  // 开团状态 0：未开团，1：已开团

              prize:false,   //兑奖状态 false:已兑奖 true:未兑奖

              team_progress:'',// 开团进度，0/5：人数
              help: true,
              member: []
            }
        }
    },
    created () {
      //console.log('location.search:',location.search);

      //this.getOptions();
      //this.locationSearch = location.search;
      // setTimeout(()=>{
      //   this.locationSearch = location.search;
      // },2000);
      this.getOptions();
      console.log('options:',this.options);

      let rt = new ReTime();
      let rt_timer = setInterval(()=>{
        try{
          this.reTimeData = rt.setTime(rt_timer);
        }catch(e){
          console.log("计时事件出错 30334:",e);
          if(rt_timer) {
            clearInterval(rt_timer);
            rt_timer = 0;
          }
        }
      },1000);

      this.$store.dispatch('fetchIndexAction', {
        uid:this.options.mid, prizeid:this.options.pgid
      });

      // 如果 cookie 缓存存在，则显示 accesstoken
      // let accesstoken = getCookie('accesstoken') || 'a97e7a07-e6ee-4fa1-942b-a7a06015e28b';
      // if (accesstoken) {
      //     this.accesstoken = accesstoken
      // }
    },
    computed: {
        ...mapState([
            'user_info',
            'globalData',
            'tool'
        ]),
        ...mapGetters([
            'REPLIES_COUNT',
            'COLLECTS_COUNT',
            'MY_TOPICS_COUNT'
        ])
    },
    components: {
        // snackbar,
        // mainProgress
    },
    methods: {
        ...mapMutations([
            'SHOW_MAIN_OVERFLOW',
            'LOGOUT',
            'CLEAR_MSG_DATA'
        ]),
        openSignupIndex(){

        },
        download(){

        },
        joinSpell(){

        },
        getOptions(){
          let _arr = location.search.replace(/^\?/,'').split('&');
          let _obj = {};
          for(let _i=0;_i<_arr.length;_i++){
            let _c = _arr[_i].split("=");
            if(_c.length >= 2){
              if(_c[0] == 'mid') _obj.mid = _c[1];
              if(_c[0] == 'phone') _obj.phone = _c[1];
              if(_c[0] == 'gid') _obj.pgid = _c[1];
            }
          }
          this.options = _obj;
          return _obj;
        },


        // ----- log in
        tapToLogIn () {
            // 判断输入
            if (!this.accesstoken) {
                this.$store.dispatch('showSnackbarAction', {
                    msg: 'accesstoken 不能为空',
                    isWarn: true
                })
                return
            }
            // 发送登录请求
            this.$store.dispatch('fetchUserAction', {
                accesstoken: this.accesstoken
            });
        },
        // ----- log out
        tapToLogOut () {
            this.LOGOUT();
            this.CLEAR_MSG_DATA();
            this.$store.dispatch('showSnackbarAction', {
                msg: '已退出登录',
                isWarn: false
            })
        },
        // ----- 跳转到 usertopics
        tapToUserTopics (title, type) {
            // 锁定根路由
            this.$store.commit('SHOW_MAIN_OVERFLOW');
            this.$router.push({ name: 'usertopics', params: { title, type } })
        },
        // 点击切换提示显示
        tapToToggleTip () {
            this.isTipShow = !this.isTipShow
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/sass/_base.scss';
.index-panel {
    // background: $ExtraLightGray;
    .head {
      margin-bottom: 30px
    }
    .head .top-banner {
      width:100%;
      height:48.5vw;
      position:relative;
    }
    .head .top-banner .t-b-right-btn {
      width:43px;
      position:absolute;
      right:0;
      top:50%;
      margin-top:-24px;
    }
    .head .head-text-cell {
      margin-top:-30px;
      position:relative;
    }
    .head .head-text-cell .head-text-view {
      background-color: #fff;
      border:1px solid #555;
      display: inline-block;
      min-width: 50%;
      border-radius: 30px;
      padding:10px 60px;
      line-height: 1em;
      font-size: 26px;
    }
    .head .head-text-cell .head-text-view span {
      vertical-align: middle;
    }
    .head .head-text-cell .head-text-view .text-spacing {
      letter-spacing:.25em;
    }
    .head .head-text-cell .head-text-view .time-num {
      background-color: rgba(0,0,0,.5);
      color:#fcfcfc;
      font-size: .9em;
      padding:2px 4px;
      display: inline-block;
      line-height: normal;
    }
    .main .instruction-cell {
      font-size: 26px;
      position:relative;
      padding-top:10px;
      margin:20px 16px 60px;
    }
    .main .instruction-cell .i-c-title {
      background-color:#ff9000;
      font-size: .95em;
      border-radius: 30px;
      padding:4px 10px;
      line-height: 1em;
      position:absolute;
      left:24px;
      top:0;
    }
    .main .instruction-cell .i-c-text {
      background-color: #ff3333;
      line-height: 1.7em;
      padding:40px 36px 20px;
      border-radius: 16px
    }
    .m-top-count, .user-list, .user-list .user-item {
      padding:0 22px
    }
    .user-list {
      margin:20px 0;
    }
    .user-list .user-item {
      overflow: hidden;
    }
    .user-list .user-item .user-pic {
      position:relative;
      max-width:100%;
      font-size:0;
      margin-bottom: 16px;
    }
    .user-list .user-item .user-pic .users-main-text {
      position:absolute;
      right:0;
      bottom:0;
      width:25px;
    }
    .user-list .user-item .user-pic .user-avatar {
      max-width:100%;
      border-radius: 50%;
      border:1px solid #ddd;
      height:calc(20vw - 9px - 44px);
    }
    .user-list .user-item .user-type-icon {
      width:27px;
      max-height:27px;
    }
    .main .m-top-count .users-count {
      display: inline-block;
      background-color: rgba(0,0,0,.45);
      border-radius: 12px;
      font-size: 12px;
      line-height: 1em;
      padding:0 20px;
      color:#fff;
    }
    .main .m-top-count .users-count span {
      padding:4px 0;
      display: inline-block;
    }
    .main .m-top-count .users-count:after {
      content:" ";
      display:inline-block;
      height:6px;
      width:6px;
      border-width:1px 1px 0 0;
      border-color:#fff;
      border-style:solid;
      -webkit-transform:matrix(.71,.71,-.71,.71,0,0);
      transform:matrix(.71,.71,-.71,.71,0,0);
      position:relative;
      /*top:-2px;*/
      /*margin-top:-4px;
      right:2px;*/
      vertical-align: middle;
    }
    .main .image-list > img {
      width:100%;
      display: block;
      margin:20px auto;
    }
    .main .image-list .arrow-icon {
      width:31px;
    }
    .main .main-btn {
      padding:0 44px;
      margin:50px 0;
    }
    .main .main-btn button {
      font-size: 40px;
      border-radius: 20px;
      line-height: 2.8em
    }


    .lottery-cell .lottery-item {
      padding:10px 0;
      margin:20px 0;
    }
    .lottery-cell .lottery-item .l-i-head {
      margin-bottom: 14px;
    }
    .lottery-cell .lottery-item .l-i-head .l-i-h-id{
      display: inline-block;
      padding:2px 8px;
      background-color:#ff4747;
      color:#fff;
      font-size:12px;
      border-radius: 2px;
      line-height: 1em;
    }
    .lottery-cell .lottery-item .l-i-head .l-i-h-right{
      display: inline-block;
      padding:4px 8px 4px 10px;
      background-color:#ff4747;
      color:#fff;
      font-size:14px;
      line-height: 1em;
      -moz-border-radius-topleft: 20px;
      -moz-border-radius-bottomleft: 20px;
      -o-border-radius-topleft:20px;
      -o-border-radius-bottomleft:20px;
      -webkit-border-top-left-radius: 20px;
      -webkit-border-bottom-left-radius: 20px;
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
    }
    .lottery-list .lottery-item .l-i-main {
      padding:10px 20px;
    }
    .l-i-m-num-list .l-i-m-num-item {
      /*display: inline-block;*/
      margin:0 6px;
      width:41px;
      max-width: 82px;
      height:42px;
      position:relative;
    }
    .l-i-m-num-list .l-i-m-num-item span {
      display: block;
      line-height: 40px;
      position:absolute;
      top:50%;
      left:0;
      font-size: 34px;
      margin-top:-21px;
      width:100%;
      text-align: center;
      color:#fff;
    }
    .l-i-m-num-list .l-i-m-num-list-right {
      text-align: right;
    }
}
</style>
