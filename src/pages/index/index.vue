<template>
    <div class="index-panel">
      <div class="container">
        <div class="head textcenter">
          <div class="top-banner loadimg-default" :style="'background-image:url('+globalData.localimg+'image/banner.png)'">
            <img class="t-b-right-btn" :src="globalData.localimg+'image/banner_right_btn.png'" @click="tapMessage"></img>
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
        <div class="p-main textcenter">
          <div class="main-content">
            <div class="m-top-count textright">
              <div class="users-count"><span class="middle">{{globalData.priceData.list?globalData.priceData.list.length:1}}/5 邀请进度</span></div>
            </div>
            <div class="user-list flex2 flex-line">
              <div v-for="(users_item,users_index) in [0,1,2,3,4]" class="user-item">
                <div class="user-pic">
                  <img v-if="globalData.priceData.list && globalData.priceData.list[users_item]" @click="users_index>0 ? 'joinSpell':''" class="user-avatar" :src="globalData.priceData.list[users_item].helpheadimg.replace(/^(\/){1,2}group1/,globalData.imghost+'//group1')"></img>
                  <img v-else @click="joinSpell" class="user-avatar" :src="globalData.localimg+'image/user_type_bg_'+users_index+'.png'"></img>
                  <img v-if="users_index == 0" class="users-main-text" :src="globalData.localimg+'image/users_main_text.png'"></img>
                </div>
                <img class="user-type-icon" :src="globalData.localimg+'image/user_type_'+((globalData.priceData.list && globalData.priceData.list[users_item])?'light':'default')+'_'+users_index+'.png'"></img>
              </div>
            </div>
            <div class="main-btn">
              <template v-if="options.mid == '' || options.pgid=='' || options.phone==''">
                <div class="textcenter red">数据参数错误</div>
              </template>
              <template v-else-if="globalData.priceData.list && globalData.priceData.list.length < 5">
                <button class="btn-main" @click="joinSpell">立即帮好友助力</button>
              </template>
               <template v-else>
                <button class="display btn-main">本团已满</button>
              </template>
            </div>

            <div class="image-list">
              <img class="arrow-icon" :src="globalData.localimg+'image/arrow_default.png'"></img>
              <img :src="globalData.localimg+'image/daletou.png'"></img>
              <img class="arrow-icon" :src="globalData.localimg+'image/arrow_default.png'"></img>
              <img @click='download' :src="globalData.localimg+'image/downloadapp.png'"></img>
            </div>
          </div>
        </div>
        <div class="foot">

        </div>
      </div>

      <!--Children Router-->
      <transition enter-active-class="animated opacityIn"
                  leave-active-class="animated opacityOut">
          <router-view class="details"></router-view>
      </transition>
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
            }
        }
    },
    created () {
      //console.log('location.search:',location.search);

      //this.locationSearch = location.search;
      // setTimeout(()=>{
      //   this.locationSearch = location.search;
      // },2000);
      // console.log(this.globalData);

      this.getOptions();
      console.log('options:',this.options);

      let rt = new ReTime();
      let rt_func = ()=>{
        try{
          this.reTimeData = rt.setTime(rt_timer);
        }catch(e){
          console.log("计时事件出错 30334:",e);
          if(rt_timer) {
            clearInterval(rt_timer);
            rt_timer = 0;
          }
        }
      };
      let rt_timer = setInterval(rt_func,1000);
      rt_func();

      this.$store.dispatch('fetchIndexAction', {
        uid:this.options.mid, prizeid:this.options.pgid, callback:()=>{
          //console.log("end?",this.globalData.priceData.timestamp);
          rt.uploadEndDate(this.globalData.priceData.timestamp); //更新截止时间
        }
      });
    },
    computed: {
        ...mapState([
            'globalData'
        ]),
        ...mapGetters([
        ])
    },
    components: {
        // snackbar,
        // mainProgress
    },
    methods: {
        ...mapMutations([
            'SHOW_PANEL_OVERFLOW'
        ]),
        download(){
          //location.href='http://dtznapp-1254344927.cosgz.myqcloud.com/aifenqian.apk';
          location.href='http://sj.qq.com/myapp/detail.htm?apkName=com.dtzn.dtrobot';
        },
        joinSpell(){
          //console.log(222)
          this.$store.commit('SHOW_PANEL_OVERFLOW');
          this.$router.push({ name: 'fixedPanel', params: { title:'拼大奖', type:0 } })


          // this.$store.dispatch('fetchHelpAction', {
          //   uid:this.options.mid, prizeid:this.options.pgid, callback:()=>{
          //     //console.log("end?",this.globalData.priceData.timestamp);
          //     rt.uploadEndDate(this.globalData.priceData.timestamp); //更新截止时间
          //   }
          // });
        },
        getOptions(){
          let _arr = location.search.replace(/^\?/,'').split('&');
          //let _obj = {};
          for(let _i=0;_i<_arr.length;_i++){
            let _c = _arr[_i].split("=");
            if(_c.length >= 2){
              if(_c[0] == 'mid') this.options.mid = _c[1];
              if(_c[0] == 'phone') this.options.phone = _c[1];
              if(_c[0] == 'gid') this.options.pgid = _c[1];
            }
          }
          //this.options = _obj;
          //return _obj;
        },
        tapMessage(){
          this.$router.push({ name: 'message', params: { title:'活动说明', type:1 } })
        }
    }
}
</script>

<style lang="scss">
@import '../../assets/sass/_base.scss';
.index-panel {
    font-size: .3rem;
    // background: $ExtraLightGray;
    .btn-main {
      background-color:#ff6600;
      color:#fff;
    }
    .btn-main.display {
      background-color:#e8965f;
    }
    .head {
      margin-bottom: .3rem;
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
      margin-top:-.3rem;
      position:relative;
    }
    .head .head-text-cell .head-text-view {
      background-color: #fff;
      border:1px solid #555;
      display: inline-block;
      min-width: 50%;
      border-radius: 30px;
      padding:.09rem .4rem;
      line-height: 1em;
      font-size: .25rem;
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
      font-size: .8em;
      padding:2px 4px;
      display: inline-block;
      line-height: normal;
    }
    .p-main .instruction-cell {
      font-size: .25rem;
      position:relative;
      padding-top:10px;
      margin:20px 16px 60px;
    }
    .p-main .instruction-cell .i-c-title {
      background-color:#ff9000;
      font-size: .95em;
      border-radius: 30px;
      padding:4px 10px;
      line-height: 1em;
      position:absolute;
      left:24px;
      top:0;
    }
    .p-main .instruction-cell .i-c-text {
      background-color: #ff3333;
      line-height: 1.7em;
      padding:40px 36px 20px;
      border-radius: 16px
    }
    .m-top-count, .user-list, .user-list .user-item {
      padding:0 .2rem;
    }
    .user-list {
      margin:.2rem 0;
    }
    .user-list .user-item {
      overflow: hidden;
      width:19.99%;
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
      display: block;
      max-width:100%;
      border-radius: 50%;
      border:1px solid #ddd;
      height: calc(20vw - .08rem - .4rem);
      overflow: hidden
    }
    .user-list .user-item .user-type-icon {
      width:27px;
      max-height:27px;
    }
    .p-main .m-top-count .users-count {
      display: inline-block;
      background-color: rgba(0,0,0,.45);
      border-radius: 12px;
      font-size: 12px;
      line-height: 1em;
      padding:0 20px;
      color:#fff;
    }
    .p-main .m-top-count .users-count span {
      padding:4px 0;
      display: inline-block;
    }
    .p-main .m-top-count .users-count:after {
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
    .p-main .image-list > img {
      width:100%;
      display: block;
      margin:20px auto;
    }
    .p-main .image-list .arrow-icon {
      width:31px;
    }
    .p-main .main-btn {
      padding:0 44px;
      margin:50px 0;
    }
    .p-main .main-btn button {
      font-size: .4rem;
      border-radius: .18rem;
      line-height: 2.8em;
      display: block;
      width: 100%;
      border: none;
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
