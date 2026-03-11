<template>
  <view class="content">
    <image 
      class="home-bg"
      :src="imageUrl"
      mode="scaleToFill"
    />
    <view class="handle-body">
      <view class="handle-btn handle-delivery" @tap="onDelevery">送煤气</view>
      <view class="handle-btn handle-record" @tap="onApplyRecoed">申请记录</view>
    </view>
    <!-- 手机输入弹窗 -->
    <uni-popup ref="phonePopupRef" :is-mask-click="false">
      <telphoneInputPopup
        @closePopup="handleClose"
        @submit="handleSubmit"
       />
    </uni-popup>
  </view>
</template>

<script setup>
  import {getCloudFileUrl} from '@/utils/cloud.js'
  import telphoneInputPopup from '@/wxcomponents/telphone-input-popup'
  import {onMounted, reactive, ref, getCurrentInstance} from 'vue'
  import { storeToRefs } from 'pinia'
  import {useUserStore} from '@/stores/user/index.js'

  const userStore = useUserStore();
  const { userPhone } = storeToRefs(userStore)

  const instance = getCurrentInstance()
  const app = getApp();
  const {phone} = app?.globalData?.userInfo || {}
  const imageUrl = ref('');
  const state= reactive({})

  let toPath = '' ;

  /** 更新首页背景图 */
  const updateImageUrl = () =>{
    getCloudFileUrl('cloud://cloud1-4g8i7f3ofd6fe36d.636c-cloud1-4g8i7f3ofd6fe36d-1407373655/images/gas-home-bg.png').then(url => {
      imageUrl.value = url;
    });
  }


  /** 点击煤气配送按钮 */
  const onDelevery = () =>{
    toPath = '/pages/deliveryApply/index'
    //校验用户是否填写了手机号
    if(!userPhone) {
      instance.refs.phonePopupRef.open('center')
      return 
    }
    //点击跳转提交配送请求页面
    _navigateTo(toPath)
  }

  //查看历史的申请记录
  const onApplyRecoed = () =>{
    toPath = '/pages/applyList/index'
    //校验用户是否填写了手机号
    if(!userPhone) {
      instance.refs.phonePopupRef.open('center')
      return 
    }
    _navigateTo(toPath)
  }

  const _navigateTo = (toPath) =>{
    uni.navigateTo({
      url: toPath
    });
  }

  /** 关闭手机输入的弹窗 */
  const handleClose = () =>{
    instance.refs.phonePopupRef.close()
  }

  const handleSubmit = () =>{
    _navigateTo(toPath)
  }

  onMounted(() =>{
    //获取首页背景图
    updateImageUrl();    
  })
</script>

<style lang="scss" scoped>
::v-deep .uni-forms-item__label{
  font-size: 36rpx !important;
  height: 90rpx;
}
::v-deep .uni-forms-item__content{
  display: flex;
  align-items: center;
  font-size: 36rpx;
}
::v-deep .is-input-border{
  padding: 20rpx 0rpx;
} 
::v-deep .uni-easyinput__content-input{
  font-size: 36rpx;
}
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}

.home-bg {
  width: 750rpx;
  height: 100vh;
}

.handle-body{
  position: absolute;
  bottom: 120rpx;
  .handle-btn{
    display: flex;
    margin: 0rpx 60rpx;
    width: 510rpx;
    height: 120rpx;
    justify-content: center;
    align-items: center;
    background: $uni-color-warning;
    border-radius: 120rpx;
    font-size: 42rpx;
    color: #fff;
  }
  .handle-record{
    margin-top: 40rpx;
    background: $uni-color-success;
  }
}

</style>
