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
            <view class="apply-time">申请时间：2026-03-01 13:00:00</view>
            <view class="completion-time">完成时间：2026-03-01 16:00:00</view>
          </view>
          <view class="status-box">处理中</view>
        </view>
        <view class="voice-list">
          <view class="voice-item" 
            v-for="(sItem, sIndex) in voiceList" 
            :key="sIndex"
          >
            <view class="user-item">
              <image class="icon-user" src="/static/images/icon-men.png" />
            </view>
            <view class="voice-box" @tap="playVoice(item.path)">
              <icon class="iconfont icon-yuyin"></icon>
              <view class="voice-name">录音_{{sIndex+1}}.mp3</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="empty-box" v-else>暂无数据</view>
  </view>
</template>

<script setup>
import {onMounted, reactive} from 'vue'
import apis from '@/apis/index.js'
import { useUserStore } from '@/stores/user/index.js'

  const userStore = useUserStore();
  const userId = userStore.userId

  const state = reactive({
    filterDate:'', //筛选时间
    list:[], //列表数据
  })

  //初始化当前时间
  const initDate = () =>{
    const nowDate = new Date()
    const year = nowDate.getFullYear();
    const maoth = nowDate.getMonth() + 1 ;
    const currentDate = `${year}-${maoth}`
    state.filterDate = currentDate
  }

  /** 获取申请记录列表 */
  const getList = async () =>{
    const res = await apis.fetchApplyList({
      date:state.filterDate,
      userId:userId
    })
    if(res.code === 1){
      state.list = res.data || []
    }
  }

  /** 选择时间 */
  const changeDate = (event) =>{
    const value = event?.detail?.value || ''
    state.filterDate = value
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
      border-radius: 10rpx;
      padding: 20rpx;
      margin-bottom: 20rpx;
    }
    .base-info{
      display: flex;
      justify-content: space-between;
      padding: 20rpx 0rpx;
      border-bottom: 2rpx solid #c0c0c0;
      .time-box{
        font-size: 32rpx;
        color: #000;
      }
      .status-box{
        font-size: 40rpx;
        color: #4cd964;
        display: flex;
        align-items: center;
      }
    }
    .voice-list{
      margin-top: 20rpx;
      padding-bottom: 20rpx;
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
      // .voice-item{
      //   width: 300rpx;
      //   height: 60rpx;
      //   background: #4cd964;
      //   font-size: 36rpx;
      //   display: flex;
      //   justify-items: center;
      //   align-items: center;
      //   margin-bottom: 20rpx;
      //   .icon-yuyin{
      //     color: #fff;
      //     font-size: 40rpx;
      //   }
      //   .voice-name{
      //     color: #fff;
      //     margin-left: 10rpx;
      //   }
      // }
    }
  }
  .empty-box{
    font-size: 36rpx;
    color: #000;
    padding: 300rpx 100rpx 0rpx;
    flex: 1;
    text-align: center;
  }
}
</style>
