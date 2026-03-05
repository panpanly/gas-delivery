<template>
  <view class="content">
  <view class="chat-box">
    <view class="voice-list" v-if="savedVoiceList.length">
      <view 
        class="voice-item" 
        v-for="(item, index) in savedVoiceList" 
        :key="index"
      >
        <view class="user-item">
          <image class="icon-user" src="/static/images/icon-men.png" />
        </view>
        <view class="voice-box" @tap="playVoice(item.path)">
          <icon class="iconfont icon-yuyin"></icon>
          <view class="voice-name">录音_{{index+1}}.mp3</view>
        </view>
      </view>
    </view>
    <view v-else-if="tipText" class="record-text">{{tipText}}</view>
    <view 
      v-if="!isRecording"
      class="record-btn start-btn" 
      @tap="startRecord">开始录音</view>
    <view
      v-else
      class="record-btn end-btn" 
      @tap="stopRecord">停止录音</view>
    </view>
    <view class="handle-box">
      <view class="handle-apply" @tap="handleSubmit">提交申请</view>
    </view>
  </view>
</template>

<script>
import apis from '@/apis/index.js'
const app = getApp();
export default {
  data() {
    return {
      recorderManager: null, // 录音管理器实例
      isRecording: false, // 是否正在录音
      tipText: '', // 提示文本
      savedVoiceList: [], // 已保存的语音列表
      telphone:'',
      customPlaceholderStyle:'font-size:36rpx;'
    }
  },
  onLoad() {
    // 初始化录音管理器
    this.initRecorder();
    // 检查录音权限
    this.checkRecordAuth();
  },
  methods: {

    // 初始化录音管理器
    initRecorder() {
      // 获取小程序录音管理器（仅小程序端有效）
      this.recorderManager = uni.getRecorderManager();
      
      // 录音错误回调
      this.recorderManager.onError((err) => {
        this.isRecording = false;
        this.tipText = `录音失败：${err.errMsg}`;
      });
      
      // 录音停止回调（获取录音文件）
      this.recorderManager.onStop((res) => {
        this.isRecording = false;
        this.tipText = '录音完成，正在保存...';
        
        // 保存录音到本地
        this.saveVoiceToLocal(res);

      });
    },

    // 检查录音权限
    checkRecordAuth() {
      uni.getSetting({
        success: (res) => {
          // 未授权录音权限
          if (!res.authSetting['scope.record']) {
            uni.authorize({
              scope: 'scope.record',
              success: () => {
                this.tipText = '录音权限已授权';
              },
              fail: () => {
                this.tipText = '请手动开启录音权限，否则无法使用录音功能';
                // 引导用户打开设置页
                uni.openSetting({
                  success: (settingRes) => {
                    if (settingRes.authSetting['scope.record']) {
                      this.tipText = '录音权限已开启';
                    }
                  }
                });
              }
            });
          }
        }
      });
    },

    // 保存录音到本地
    saveVoiceToLocal(voiceRes) {
      uni.saveFile({
        tempFilePath: voiceRes.tempFilePath, // 录音临时文件路径
        success: (saveRes) => {
          const savedPath = saveRes.savedFilePath;
          this.tipText = '语音已保存到本地';
          //保存到云存储
          this.uploadVoiceToServer(savedPath);
        },
        fail: (err) => {
          this.tipText = `保存失败：${err.errMsg}`;
        }
      });
    },

    // 开始录音
    startRecord() {
      if (this.isRecording) return;
      
      // 录音配置（格式、采样率等，根据需求调整）
      const options = {
        duration: 60000, // 最长录音时间，单位ms（最大60000）
        sampleRate: 16000, // 采样率
        numberOfChannels: 1, // 声道数
        encodeBitRate: 96000, // 编码码率
        format: 'mp3' // 录音格式，小程序支持 mp3/wav/aac
      };
      
      this.isRecording = true;
      this.tipText = '录音中...';
      this.recorderManager.start(options);
    },

    // 停止录音
    stopRecord() {
      if (!this.isRecording) return;
      this.recorderManager.stop();
    },

    // 播放已保存的语音
    playVoice(path) {
      const innerAudioContext = uni.createInnerAudioContext();
      innerAudioContext.src = path;
      innerAudioContext.play();
      
      // 播放结束销毁实例
      innerAudioContext.onEnded(() => {
        innerAudioContext.destroy();
      });
      
      // 播放错误处理
      innerAudioContext.onError((err) => {
        this.tipText = `播放失败：${err.errMsg}`;
        innerAudioContext.destroy();
      });
    },

    // 点击提交申请时上传到服务器
    async uploadVoiceToServer(voiceRes) {
      // 自定义云存储路径：audio/用户openid/时间戳_随机数.后缀
      const cloudPath = `audio/${app.globalData.openid}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${voiceRes.split('.').pop()}`
         
      const uploadRes = await apis.updateAudioFileApi({
        cloudPath,
        filePath: voiceRes
      })
      if(uploadRes.code === 1){
        const {fileID} = uploadRes.data || {}
        // 将保存的语音添加到列表
        this.savedVoiceList.push({
          path: voiceRes,
          fileID:fileID
        });
      }
      
    },

    /**
     * 数据校验
     */
    dataValidate(){
      const {savedVoiceList,telphone} = this ;
      if(!savedVoiceList.length){
        this.$toast('请先录音！')
        return false
      }
      if(!telphone){
        this.customPlaceholderStyle = 'font-size:36rpx;color:#dd524d'
        this.$toast('请先填写手机号！')
        return false
      }
    },

    /**
     * 提交申请
     */
    handleSubmit(){
      //1 数据校验
      const isvalidateResult = this.dataValidate();
      if(!isvalidateResult) return 
      //2 获取入参
      //3 提交请求
    },
  },
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
    .voice-list{
      .voice-item{
        display: flex;
        margin: 40rpx 32rpx;
        .user-item{
          width:60rpx;
          height: 60rpx;
          padding: 20rpx;
          margin-right: 20rpx;
          .icon-user{
            width: 100%;
            height: 100%;
          }
        }
        .voice-box{
          width: 400rpx;
          height: 60rpx;
          border-radius: 60rpx;
          background: $uni-color-success;
          display: flex;
          justify-items: center;
          align-items: center;
          padding: 20rpx;
          font-size: 36rpx;
          .icon-yuyin{
            color: #fff;
            font-size: 40rpx;
          }
          .voice-name{
            color: #fff;
            margin-left: 10rpx;
          }
        }
      }
    }
    .record-text{
      position: absolute;
      left: 40%;
      top: 40%;
      font-size: 40rpx;
      color: $uni-color-success;
      width: 200rpx;
      text-align: center;
    }
    .record-btn{
      margin:0rpx 84rpx;
      width: 510rpx;
      height: 120rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 42rpx;
      border-radius: 120rpx;
      position: absolute;
      bottom: 40rpx;
      left: 0;
    }
    .start-btn{
      background: $uni-color-success;
    }
    .end-btn{
      background:$uni-color-warning
    }
  }
  .cell-box{
    display: flex;
    align-items: center;
    padding: 30rpx 24rpx;
    margin-top: 40rpx;
    .cell-title{
      font-size: 36rpx;
      color: #000;
    }
    .cell-content{
      width:75%;
      height: 100rpx;
      border: 2rpx solid $uni-color-success;
      border-radius: 100rpx;
      .cell-input{
        height: 80rpx;
        line-height: 80rpx;
        padding: 10rpx 20rpx 10rpx 50rpx;
      }
    }
  }
  .handle-box{
    margin-top: 40rpx;
    .handle-apply{
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
    }
  }
}


</style>
