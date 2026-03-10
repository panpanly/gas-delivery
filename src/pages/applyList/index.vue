<template>
  <view class="container">
    <!-- 月份筛选 -->
    <view class="date-filter-body">
      <view class="filter-title">筛选月份：</view>
      <picker class="filter-picker" mode="date" :value="state.filterDate" fields="month" @change="changeDate">
        <view class="picker">
          {{state.filterDate}}
        </view>
      </picker>
    </view>
    <!-- 申请内容 -->
    <view class="content" v-if="state.list.length">
      <view class="record-item" 
        v-for="(pItem, pIndex) in state.list" 
        :key="pIndex">
        <view class="base-info">
          <view class="time-box">
            <view class="apply-time">创建时间：{{pItem.createTimeStr}}</view>
            <view class="completion-time">更新时间：{{pItem.updateTimeStr}}</view>
          </view>
        </view>
        <view class="voice-list">
          <view class="voice-item" 
            v-for="(sItem, sIndex) in pItem.fileInfoList" 
            :key="sIndex"
          >
            <view class="user-item">
              <image class="icon-user" src="/static/images/icon-men.png" />
            </view>
            <view class="voice-box" @tap="playVoice(sItem.fileUrl)">
              <icon class="iconfont icon-yuyin"></icon>
            </view>
          </view>
        </view>
        <view class="status-body">
          <view class="status-left flex-row-center">处理中</view>
          <view class="status-right flex-row-center">点击查看更多 {{'>>'}}</view>
        </view>
      </view>
    </view>
    <view class="empty-box" v-else-if="state.loadFinished">暂无数据</view>
  </view>
</template>

<script setup>
import {onMounted, reactive} from 'vue'
import apis from '@/apis/index.js'
import { useUserStore } from '@/stores/user/index.js'
import { formatTime } from '@/utils/timeUtil.js'

  const userStore = useUserStore();
  const userId = userStore.userId

  const state = reactive({
    filterDate:'', //筛选时间
    list:[], //列表数据
    loadFinished:false,
  })

  //初始化当前时间
  const initDate = () =>{
    state.filterDate = formatTime(new Date,'YYYY-MM')
  }

  /** 列表数据处理 */
  const dataListConverter = (list = []) =>{
    if(!list.length) return []
    list.forEach(item =>{
      item.createTimeStr = formatTime(item.createTime,'YYYY-MM-DD HH:mm')
      item.updateTimeStr = formatTime(item.updateTime,'YYYY-MM-DD HH:mm')
    })
    return list
  }

  /** 获取申请记录列表 */
  const getList = async () =>{
    state.loadFinished = false
    const res = await apis.fetchApplyList({
      date:state.filterDate,
      userId:userId
    })
    state.loadFinished = true
    if(res.code === 1){
      state.list = dataListConverter(res?.data)
      console.error('====>>>>>>list',state.list);
      
    }
  }

  /** 选择时间 */
  const changeDate = (event) =>{
    const value = event?.detail?.value || ''
    state.filterDate = value
    getList()
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

  onMounted(() =>{
    //初始化筛选日期
    initDate();
    //根据筛选日期获取列表数据
    getList()
  })

</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  .date-filter-body{
    display: flex;
    width: 100%;
    height: 100rpx;
    align-items: center;
    padding: 40rpx 0rpx;
    background: #fff;
    position: fixed;
    top: 0;
    left: 0;
    .filter-title{
      font-size: 40rpx;
      color: #000;
      margin-right:10rpx;
      padding-left: 40rpx;
    }
    .filter-picker{
      border: 2rpx solid #000;
      width: 210rpx;
      height: 80rpx;
      padding: 0rpx 40rpx;
      border-radius: 80rpx;
      display: flex;
      align-items: center;
      font-size: 40rpx;
    }
  }
  .content{
    margin: 200rpx 24rpx 20rpx 24rpx;
    .record-item{
      background: #fff;
      padding: 20rpx;
      margin-bottom: 20rpx;
    }
    .base-info{
      display: flex;
      justify-content: space-between;
      padding: 20rpx 0rpx;
      border-bottom: 2rpx solid #ccc;
      .time-box{
        font-size: 36rpx;
        line-height: 60rpx;
        color: #666;
      }
      .status-box{
        font-size: 40rpx;
        color: #4cd964;
        display: flex;
        align-items: center;
      }
    }
    .voice-list{
      margin: 20rpx 0rpx;
      .voice-item{
        display: flex;
        margin-bottom: 20rpx;
      }
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

    .status-body{
      padding: 30rpx 24rpx;
      border-top: 2rpx solid #ccc;
      display: flex;
      justify-content: space-between;
      .status-left{
        display: flex;
        font-size: 36rpx;
        color: #4cd964;
      }
      .status-right{
        border-radius: 20rpx;
        font-size: 30rpx;
        border: 2rpx solid #666;
        width: 300rpx;
        height: 80rpx;
      }
    }
  }
  .empty-box{
    font-size: 36rpx;
    color: #bbb;
    padding: 300rpx 100rpx 0rpx;
    flex: 1;
    text-align: center;
  }
}
</style>
