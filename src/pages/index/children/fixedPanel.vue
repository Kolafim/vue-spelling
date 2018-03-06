<template>
  <div class="f-p-container flex-fixed" @click="closeSignup">
      <div class="signup-panel">
        <div :class="'signup-panel-animat animated small ' + (globalData.animat?'zoomIn':'zoomOut')" @click.stop="eventFalse($event)">
          <div v-if="globalData.help_success == 0" class="signup-panel-main">
            <!-- <signup v-if="{{!signup_hidden}}">
              <button slot="s2" class="signup-close" catchtap="closeSignup">close sign</button>
            </signup> -->
            <div class="signup-content">

              <div class="signup-head textcenter">
                <img class="s-h-icon" :src="globalData.localimg + 'image/logo.png'"></img>
              </div>
              <div class="signup-main">
                <div class="signup-input-cell flex-line">
                  <div class="l-i-c-left-icon"></div>
                  <input maxlength='11' class="signup-input phone-input flex-1" type="tel" placeholder="手机号" v-model="phoneValue" />
                  <div :class="'l-i-c-right-clear ' + (phoneValue.length > 0?'show':'')" @click="clearPhoneInput">×</div>
                </div>
                <div class="signup-input-cell flex-line">
                  <div class="l-i-c-left-icon"></div>
                  <input maxlength='6' class="signup-input flex-1" type="number" placeholder="验证码" v-model="regValue"/>
                  <button v-if="globalData.regTime > 0" class="l-i-c-right-reg-btn btn-main display">{{globalData.regTime}}s</button>
                  <button v-else class="l-i-c-right-reg-btn btn-main" @click="getReg">获取验证码</button>
                </div>

              </div>
              <div class="signup-foot" >
                <button class="signup-submit btn-main" @click="helpUserSubmit">助 力</button>
                <!-- <button v-else class="signup-submit btn-main" @click="signupSubmit">登 录</button> -->
                <div class="signup-input-cell textcenter">
                  <span v-if="message" :class="'inline-block animated small '+ (message.c==0?' red ':(message.c==1?' green ':' orange ')) + (message.hide?'zoomOut':'zoomIn')">{{message.msg}}</span>
                </div>
              </div>
            </div>
            <!-- <button class="signup-close" catchtap="closeSignup">close sign</button> -->
          </div>
          <div v-else>
            <div v-if="globalData.help_success == 1" class="alert-panel-main textcenter fs0">
              <img @click="alertCallBack" :src="globalData.localimg+'image/alert_img_download.png'"></img>
              <div class="footer-alert-text-btn" @click="closeSignup">关闭</div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
// import infoPage from '../../../../components/infoPage/infoPage'
// import contentItem from '../../../../components/contentItem/contentItem'
export default {
  data () {
    return {
      phoneValue:'',
      regValue:'',
      regTime:0,
      status:0,
      options:{
        mid:'',
        phone:'',
        pgid:''
      },
    }
  },
  created () {
    let routetype = this.$route.params.type;

    console.log('fixedPanel type:',routetype);

    // 判断路由类型，并使用相应的 getters
    switch (routetype) {
      case 1:
        //助力
        this.status = 0;
        // lists = this.login.userinfo.collect_topics;
        // count = this.COLLECTS_COUNT;
        break;
      case 2:
        //提示
        this.status = 1;
        // lists = this.login.userinfo.recent_replies;
        // count = this.REPLIES_COUNT;
        break;
    };

    this.getOptions();
    console.log('options:',this.options);
  },
  computed: {
    ...mapState([
      'globalData'
    ]),
    ...mapGetters([
      'COLLECTS_COUNT',
      'REPLIES_COUNT',
      'MY_TOPICS_COUNT'
    ]),
    message:{
      get:function(){
        let _m = this.globalData.message;
        console.log(_m);
        if(_m && _m.hide == 0){
          if(this.msg_timer) clearTimeout(this.msg_timer);
          this.msg_timer = setTimeout(()=>{
            this.$store.commit('MESSAGE_HIDE_TRUE');
          },3000);
        }
        return _m;
      }
    }
  },
  components: {

  },
  methods: {
    ...mapMutations([
      'MESSAGE_HIDE_TRUE',
      'HIDE_PANEL_OVERFLOW',
      'HELP_SUCCESS_INIT'
    ]),
    getReg(){
      this.$store.dispatch('fetchRegPhoneAction', {
        phoneNum:this.phoneValue
      });
    },
    clearPhoneInput(){
      this.phoneValue = '';
    },
    helpUserSubmit(){
      this.$store.dispatch('fetchHelpAction', {
        phonenum:this.phoneValue,
        uname:this.options.phone,
        prizeid: this.options.pgid,
        smscode: this.regValue
      });
    },
    alertCallBack(){
      console.log("download!");
      //location.href='http://dtznapp-1254344927.cosgz.myqcloud.com/aifenqian.apk';
      location.href='http://sj.qq.com/myapp/detail.htm?apkName=com.dtzn.dtrobot';
    },
    getOptions(){
      let _arr = location.search.replace(/^\?/,'').split('&');
      for(let _i=0;_i<_arr.length;_i++){
        let _c = _arr[_i].split("=");
        if(_c.length >= 2){
          if(_c[0] == 'mid') this.options.mid = _c[1];
          if(_c[0] == 'phone') this.options.phone = _c[1];
          if(_c[0] == 'gid') this.options.pgid = _c[1];
        }
      }
    },
    closeSignup(){
      if(this.globalData.help_success) {
        this.$store.dispatch('fetchIndexAction', {
          uid:this.options.mid, prizeid:this.options.pgid, callback:()=>{
            rt.uploadEndDate(this.globalData.priceData.timestamp); //更新截止时间
          }
        });
        setTimeout(()=>{
          this.$store.commit('HELP_SUCCESS_INIT');
        },500);
      }
      this.$router.go(-1);
      this.$store.commit('HIDE_PANEL_OVERFLOW')
    },
    eventFalse(event){
      //if(event) event.cancelBubble = true;
      return false;
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../assets/sass/_base.scss';
.f-p-container {
  width: 100%;
  height: 100%;
  font-size: .3rem;
  background-color:rgba(0,0,0,.85);

  button{
    display: block;
    border:none;
    border-radius: .12rem;
    width:auto;
  }

  .signup-panel-animat .signup-panel-main {
    background-color:#fff;
    max-width:90%;
    padding:.2rem .28rem;
    border-radius: .12rem;
    margin:0 auto;
  }
  .signup-panel-animat .signup-close {
    margin:.085rem 0;
  }
  .signup-panel-animat .alert-panel-main img {
    width:300px;
    display: block
  }

  /* children */
  .signup-content .signup-main {
    margin:.18rem 0 .26rem
  }
  .signup-head .s-h-icon {
    width:74px;
  }
  .signup-input-cell{
    position:relative;
    margin:.22rem 0;
    font-size: .26rem;
  }
  .signup-input-cell .l-i-c-right-clear {
    display: none;
  }
  .signup-input-cell .l-i-c-right-clear.show {
    display: block;
    line-height: 14px;
    font-size: 30px;
    padding: 16px;
    font-weight: 100;
    color:#fff;
    position:absolute;
    right:0;
    top:0;
  }
  .signup-input-cell .signup-input {
    background-color: #666;
    border:none;
    padding:0 10px;
    width:100%;
    height:46px;
    line-height: 46px;
    color:#fff;
    font-size:.3rem;
    border-radius:.1rem;

    &::-webkit-input-placeholder {
      color:#ddd;
      font-size:.9em;
    }
  }
  .signup-input-cell .l-i-c-right-reg-btn {
    height:46px;
    line-height: 46px;
    min-width:110px;
    margin-left:.16rem;
    font-size: .28rem
  }

  .signup-foot .signup-submit {
    width:100%;
    height:50px;
    line-height:50px;
    font-size: .34rem
  }
  .footer-alert-text-btn {
    font-size: .3rem;
    display: inline-block;
    color: #6ebbc3;
    text-decoration: underline;
    padding: .2rem .5rem;
  }

}
</style>
