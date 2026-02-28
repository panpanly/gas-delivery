<template>
  <view class="content">
    <view class="chat-box">
      <view class=""></view>
      <view class="handle-yuyin">发送语音</view>
    </view>
    <view class="handle-box">
      <view class="handle-yuyin">提交申请</view>
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
  methods: {},
}
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100vh;
  background: $uni-bg-color-grey;

  .chat-box{
    margin: 0rpx 36rpx;
    width: 678rpx;
    height: 80%;
    border: 2rpx solid $uni-color-success;
    border-radius: 50rpx;
    position: relative;
    .handle-yuyin{
      margin:0rpx 84rpx;
      width: 510rpx;
      height: 120rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      background: $uni-color-success;
      color: #fff;
      font-size: 42rpx;
      border-radius: 120rpx;
      position: absolute;
      bottom: 40rpx;
      left: 0;
    }
  }

  .handle-box{
    .handle-yuyin{
      margin: 0rpx 36rpx;
      width: 678rpx;
      height: 120rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      background: $uni-color-primary;
      color: #fff;
      font-size: 42rpx;
      border-radius: 120rpx;
      margin-top: 60rpx;
    }
  }
}


</style>
