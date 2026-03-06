<script>
import apis from '@/apis/index.js'
import {useUserStore} from '@/stores/user/index.js'
export default {
  globalData:{}, //全局变量
  onLaunch: function () {
    console.log('App Launch')
    // 检测是否支持云开发
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上版本的基础库以使用云能力');
    } else {
      // 初始化云开发
      wx.cloud.init({
        env: import.meta.env.VITE_CLOUD_ID,
        traceUser: true, // 跟踪用户行为，便于调试
      });
      this.initUserInfo();
    }
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  methods:{
    //初始化用户信息
    async initUserInfo(){
      const userStore = useUserStore()
      const res = await apis.getUserInfoApi();
      if(res.code === 1){
        const {openid,phone} = res.data || {}
        userStore.updateUserInfo({
          openid,phone
        })
      }else {
        userStore.updateUserInfo({
          openid:'',phone:''
        })
      }
    }
  },
}
</script>

<style>
/* 引入本地 iconfont 样式 */
@import "./static/iconfont/iconfont.css";
/** 全局样式 */
@import "./static/base.css";
page {
  background-color: #f5f5f5;
}
</style>
