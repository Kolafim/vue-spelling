/**
 * 倒计时
 * new ReTime()
 * .uploadEndDate(endtime) 更新截止时间
 */
export default class ReTime {
  constructor(){
    this.date = {
      default:0,
      isUpdate:1,
      redate:0,
      endTimeLoading:0,
      timeend:-1
    }
    this.uploadDate();
    setInterval(()=>this.uploadDate(),5000);
  }
  /**
   * 更新本地时间
   */
   uploadDate(){
     this.date.default = new Date().getTime();
     this.date.isUpdate = 1;
   }
   /**
    * 更新截止时间
    */
    uploadEndDate(end=0){
      if(end){
        this.date.timeend = end;
      }
    }
  /**
   * 计算时间
   */
   setTime(timer){
     if(!this.date.default) {
       console.log('获取本地时间出错');
       return {mode:0,msg:'获取本地时间出错'};
     }

     if(!this.date.redate || this.date.isUpdate) {
       this.date.redate = this.date.default;
       this.date.isUpdate = 0;
     }

     let diff = this.date.timeend - this.date.redate

     if(diff > 0){
       let t_d = Math.floor(diff / 1000 / 3600 / 24);
       let t_s = 0, t_m = 0,t_h = 0;
       if(t_d < 1){
         t_s = Math.floor(diff / 1000 % 60);
         t_m = Math.floor(diff / 1000 / 60 % 60);
         t_h = Math.floor(diff / 1000 / 3600 % 24);
       }
       this.date.redate += 1000;

       return {mode:1,d:t_d,h:this.formatnum(t_h), m:this.formatnum(t_m), s:this.formatnum(t_s)};
     }else if(this.date.endTimeLoading){
       return {mode:2,msg:'更新时间'}
     } else if (this.date.timeend == -1) {
       return { mode: 2, msg: '每周六22:00开奖' }
     }else if(!this.date.timeend){
       return {mode:2,msg:'获取截止时间出错'}
     }else{
       if(timer) {
         clearInterval(timer);
         timer = 0;
       }
       return {mode:0,msg:'已过期'}
     }
   }
  formatnum(num){
    return num<10?("0"+num):num
  }
}
