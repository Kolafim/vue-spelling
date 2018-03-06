<template>
  <div class="appbar">
    <div class="flex2 flex-line">
      <div class="a-left">
        <!-- <i class="arrow-left" @click="goback"></i> -->
      </div>
      <div class="a-center">{{title}}</div>
      <div class="a-right"> </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  props: {
    title: {
      type: String
    }
  },
  computed: {
    ...mapState([
      'login'
    ])
  },
  methods: {
    ...mapMutations([
      'SHOW_RELEASE_PAGE',
      'HIDE_RELEASE_PAGE',
      'SHOW_MAIN_OVERFLOW'
    ]),
    goback(){
      this.$router.go(-1);
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../assets/sass/_base.scss';
.appbar {
  position: relative;
  color:#fff;
  background: #f64444;
  font-size: .3rem;

  div {
    height:46px;
    line-height: 46px;
  }

  .arrow-left{
    display: block;
    padding:0 20px;
    &:after {
      content: " ";
      display: inline-block;
      height: 8px;
      width: 8px;
      border-width: 1px 1px 0 0;
      border-color: #fff;
      border-style: solid;
      -webkit-transform: matrix(-0.71, -0.71, 0.71, -0.71, 0, 0);
      transform: matrix(-0.71, -0.71, 0.71, -0.71, 0, 0);
      position: relative;
      top: -2px;
    }
  }

  .a-right {
    // width:50px;
  }
}
</style>
