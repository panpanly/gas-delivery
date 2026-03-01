<template>
  <view class="content">
    <image class="home-bg" mode="scaleToFill" src="/static/images/gas-home-bg.png"></image>
    <view class="handle-body">
      <view class="handle-btn handle-delivery" @tap="onDelevery">煤气配送</view>
      <view class="handle-btn handle-record" @tap="onApplyRecoed">申请记录</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      title: 'Hello',
    }
  },
  onLoad() {},
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
