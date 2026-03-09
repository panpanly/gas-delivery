<template>
  <view class="content">
  <view class="chat-box">
    <view class="voice-list" v-if="state.savedVoiceList.length">
      <view 
        class="voice-item" 
        v-for="(item, index) in state.savedVoiceList" 
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
    <view v-else-if="state.tipText" class="record-text">{{state.tipText}}</view>
    <view 
      v-if="!state.isRecording"
      class="record-btn start-btn" 
      @tap="startRecord">开始录音</view>
    <view
      v-else
      class="record-btn end-btn" 
      @tap="stopRecord">停止录音</view>
    </view>
    <view class="handle-box">
      <view class="handle-apply" @tap="handleSubmit">提交</view>
    </view>
  </view>
</template>

<script setup>
import apis from '@/apis/index.js'
import {useUserStore} from '@/stores/user/index.js'
import { getCurrentInstance, onMounted, reactive } from 'vue';
import {$toast} from '@/utils/util.js'
import {navigateBack} from '@/utils/navigate.js'

  //当前实例
  const instance = getCurrentInstance()
  //用户信息
  const userStore = useUserStore();
  const userPhone = userStore.userPhone
  const userId = userStore.userId
  
  //获取小程序录音管理器（仅小程序端有效）
  let recorderManager = ''

  const state = reactive({
    isRecording:false,
    tipText:'',
    savedVoiceList:[],
    customPlaceholderStyle:'font-size:36rpx;'
  })

  /**初始化录音管理器 */
  const initRecorder = () =>{
    // 获取小程序录音管理器（仅小程序端有效）
    recorderManager = uni.getRecorderManager();
    
    // 录音错误回调
    recorderManager.onError((err) => {
      state.isRecording = false;
      state.tipText = `录音失败：${err.errMsg}`;
    });
    
    // 录音停止回调（获取录音文件）
    recorderManager.onStop((res) => {
      state.isRecording = false;
      state.tipText = '录音完成，正在保存...';
      
      // 保存录音到本地
      saveVoiceToLocal(res);

    });
  }

  // 检查录音权限
  const checkRecordAuth = () =>{
    uni.getSetting({
      success: (res) => {
        // 未授权录音权限
        if (!res.authSetting['scope.record']) {
          uni.authorize({
            scope: 'scope.record',
            success: () => {
              state.tipText = '录音权限已授权';
            },
            fail: () => {
              state.tipText = '请手动开启录音权限，否则无法使用录音功能';
              // 引导用户打开设置页
              uni.openSetting({
                success: (settingRes) => {
                  if (settingRes.authSetting['scope.record']) {
                    state.tipText = '录音权限已开启';
                  }
                }
              });
            }
          });
        }
      }
    });
  }

  // 保存录音到本地
  const saveVoiceToLocal = (voiceRes) =>{
    uni.saveFile({
      tempFilePath: voiceRes.tempFilePath, // 录音临时文件路径
      success: (saveRes) => {
        const savedPath = saveRes.savedFilePath;
        state.tipText = '语音已保存到本地';
        //保存到云存储
        uploadVoiceToServer(savedPath);
      },
      fail: (err) => {
        state.tipText = `保存失败：${err.errMsg}`;
      }
    });
  }

  // 点击提交申请时上传到服务器
  const uploadVoiceToServer = async (voiceRes) =>{
    // 自定义云存储路径：audio/用户openid/时间戳_随机数.后缀
    const cloudPath = `audio/${userId}/${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${voiceRes.split('.').pop()}`
        
    const uploadRes = await apis.updateAudioFileApi({
      cloudPath,
      filePath: voiceRes
    })
    if(uploadRes.code === 1){
      const {fileID} = uploadRes.data || {}
      // 将保存的语音添加到列表
      state.savedVoiceList.push({
        path: voiceRes,
        fileID:fileID
      });
    }
  }

  // 开始录音
  const startRecord = () =>{
    if (state.isRecording) return;
      
    // 录音配置（格式、采样率等，根据需求调整）
    const options = {
      duration: 60000, // 最长录音时间，单位ms（最大60000）
      sampleRate: 16000, // 采样率
      numberOfChannels: 1, // 声道数
      encodeBitRate: 96000, // 编码码率
      format: 'mp3' // 录音格式，小程序支持 mp3/wav/aac
    };
    
    state.isRecording = true;
    state.tipText = '录音中...';
    recorderManager.start(options);
  }

  // 停止录音
  const stopRecord = () => {
    if (!state.isRecording) return;
    recorderManager.stop();
  }

  // 播放已保存的语音
  const playVoice = (path) =>{
    const innerAudioContext = uni.createInnerAudioContext();
    innerAudioContext.src = path;
    innerAudioContext.play();
    
    // 播放结束销毁实例
    innerAudioContext.onEnded(() => {
      innerAudioContext.destroy();
    });
    
    // 播放错误处理
    innerAudioContext.onError((err) => {
      state.tipText = `播放失败：${err.errMsg}`;
      innerAudioContext.destroy();
    });
  }

  /**
   * 数据校验
   */
  const dataValidate = () =>{
    const {savedVoiceList} = state ;
    if(!savedVoiceList.length){
      state.tipText = '请先录音...'
      return false
    }
    return true
  }

  /** 获取提交参数 */
  const getParams = () =>{
    const {savedVoiceList} = state ;
    const fileIds = savedVoiceList?.map(mi =>{
      return {
        fileId:mi.fileID,
        userId:userId
      }
    })
    const params = {
      userPhone,
      userId,
      fileIds
    }
    return params
  }

  /**
   * 提交申请
   */
  const handleSubmit = async ()=>{
    //1 数据校验
    const isvalidateResult = dataValidate();
    if(!isvalidateResult) return 
    //2 获取入参
    const params = getParams()
    //3 提交请求
    const res = await apis.addApplyRecord(params);
    if(res.code === 1){
      $toast('新增成功！')
      const timer = setTimeout(() =>{
        clearTimeout(timer)
        navigateBack()
      },2000)
    }
  }


  onMounted(() =>{
    // 初始化录音管理器
    initRecorder();
    // 检查录音权限
    checkRecordAuth();
  })
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
