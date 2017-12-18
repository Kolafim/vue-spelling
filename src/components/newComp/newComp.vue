<template>
  <div class="container">
    <div class="text-panel">
      <p>状态 from child：<span v-text="newStatusClone"></span></p>
      <p>childval:<span>{{childval}}</span></p>
      <p v-if="fatherval">fatherval:<span>{{fatherval}}</span></p>
      <p v-else>没有收到父组件的数据</p>
    </div>
    <div class="button-list">
      <mu-raised-button label="child event" class="demo-raised-button" @click="childEvent"/>
      <mu-raised-button label="father event" class="demo-raised-button" primary @click="toFather"/>
      <mu-raised-button label="Secondary" class="demo-raised-button" secondary/>
      <mu-raised-button label="Disabled" class="demo-raised-button" disabled/>
      <br/>
      <mu-raised-button label="full Width" fullWidth/>
    </div>
  </div>
</template>

<script>
export default {
    data(){
      return {
        childval:'child Val!',
        newStatusClone:this.newStatus
      }
    },
    props: [
        'fatherval',
        'newStatus'
    ],
    methods:{
      childEvent(){
        console.log('child click111')
        //this.newStatusClone
      },
      toFather(){
        this.$emit('childrenEvent','222222')
      }
    }
}
</script>

<style lang="scss">
@import '../../assets/sass/_base.scss';
.progress-wrapper {

    .mu-circular-progress {

    }
}
</style>
