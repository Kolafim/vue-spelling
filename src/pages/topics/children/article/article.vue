<template>
  <div class="article">
    <!--Info Page-->
    <transition enter-active-class="animated slideInUp"
                leave-active-class="animated slideOutDown">
      <infoPage vvshow="info.isInfoPageShow"></infoPage>
    </transition>
    <!--info page-->
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
import infoPage from '../../../../components/infoPage/infoPage'
export default {
  computed:{
    ...mapState([
      'info',
      'login',
      'common'
    ])
  },
  created(){
    // 初始化第一组数据；
    // 加入条件判断，只有 当前info 和 已存在的info 不同时发送请求；
    if(this.$route.params.id && this.info.id != this.$route.params.id){
      this.tapToInfo(this.$route.params.id);
    }
  },
  components:{
    infoPage
  },
  methods:{
    ...mapMutations([
      'SHOW_MAIN_OVERFLOW',
      'TOGGLE_INFO_PAGE_DISPLAY',
      'SUC_COLLECT',
      'DEL_COLLECTED'
    ]),
    // 获取详情页info
    // ========
    tapToInfo (topicid) {
      console.log(this.info);
      //this.SHOW_MAIN_OVERFLOW();
      //this.TOGGLE_INFO_PAGE_DISPLAY();
      this.$store.commit('COMMIT_ID', {
        id: topicid
      });

      // 请求数据放在了父级元素；
      // 因为不是 router 模式，子元素在没有获得 id 的情况下，就执行了 created
      this.$store.dispatch('fetchInfoAction', {
        topicid
      });

      // 点击打开详情页时匹配该文章是否被收藏
      this.checkCollected(this.login.userinfo.collect_topics, topicid)
    },
    // 检查该文章是否被收藏
    // ================
    checkCollected (collectedArr, topicid) {
      function contains (arr, obj) {
        let i = arr.length;
        while (i--) {
          if (arr[i].id === obj) {
            return true
          }
        }
        return false
      };

      if (contains(collectedArr, topicid)) {
        this.SUC_COLLECT()
      } else {
        this.DEL_COLLECTED()
      }
    }
  }
}

</script>
<style lang="scss">
@import '../../../../assets/sass/_base.scss';

</style>
