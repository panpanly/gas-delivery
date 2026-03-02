<template>
  <view class="content">
    <image 
      class="home-bg"
      :src="imageUrl"
      mode="scaleToFill"
    />
    <view class="handle-body">
      <view class="handle-btn handle-delivery" @tap="onDelevery">煤气配送</view>
      <view class="handle-btn handle-record" @tap="onApplyRecoed">申请记录</view>
    </view>
  </view>
</template>

<script>
import {getCloudFileUrl} from '@/utils/cloud.js'
export default {
  data() {
    return {
      imageUrl:'',
    }
  },
  onLoad() {
    getCloudFileUrl('cloud://cloud1-4g8i7f3ofd6fe36d.636c-cloud1-4g8i7f3ofd6fe36d-1407373655/images/gas-home-bg.png').then(url => {
      this.imageUrl = url;
    });
  },
  methods: {

    /**
     * 煤气配送
     */
    onDelevery(){
      //点击跳转提交配送请求页面
      uni.navigateTo({
        url: '/pages/deliveryApply/index'
      });
    },

    /** 申请记录 */
    onApplyRecoed(){
      uni.navigateTo({
        url: '/pages/mine/index'
      });
    },
  },
}
</script>

<style lang="scss" scoped>
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
