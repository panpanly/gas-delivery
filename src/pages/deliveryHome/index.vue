<template>
  <view class="container">
    <view class="top-box">
      <image 
        class="home-bg"
        src="@/static/images/bg-delivery-home.png"
        mode="scaleToFill"
      />
      <view class="card-box">
        <view class="total-amount flex-column-between-center">
          <view class="title">本月收入(元)</view>
          <view class="value">26587.68</view>
        </view>
        <view class="cell-month">
          <view class="cell-box flex-column-between-center">
            <view class="cell-value">796</view>
            <view class="cell-sub-title">本月已收(元)</view>
          </view>
          <view class="cell-box flex-column-between-center">
            <view class="warning-value">103</view>
            <view class="cell-sub-title">本月待收(元)</view>
          </view>
          <view class="cell-box flex-column-between-center">
            <view class="cell-value">101</view>
            <view class="cell-sub-title">本月送气(罐)</view>
          </view>
        </view>
      </view>
    </view>
    <view class="data-manage">
      <!-- 数据看版 -->
    </view>
    <view class="utils-box">
      <view class="utils-title">我的工具</view>
      <view class="utils-content">
        <view class="util-item" v-for="(item,index) in utilsList" :key="index" @tap="handleClickUtil(item)">
          <image class="util-item-icon" :src="item.icon" />
          <view class="util-item-title">{{item.title}}</view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
  import {getCloudFileUrl} from '@/utils/cloud.js'
  import {onMounted, reactive, ref, getCurrentInstance} from 'vue'
  import {$navigateTo} from '@/utils/navigate.js'

  const utilsList = [
    {
      icon:'../../static/images/icon-fabu.png',
      title:'新增商品',
      type:'addProduct',
      path:'/pages/addproduct/index',
    },
    {
      icon:'../../static/images/icon-shangpin.png',
      title:'商品管理',
      type:'production',
    },
    {
      icon:'../../static/images/icon-dingdan.png',
      title:'订单管理',
      type:'order',
    },
    {
      icon:'../../static/images/icon-huiyuan.png',
      title:'会员管理',
      type:'users',
    }
  ]

  const instance = getCurrentInstance()
  const app = getApp();
  const imageUrl = ref('');
  const state= reactive({
    utilsList
  })

  /** 选择工具 */
  const handleClickUtil = (item) =>{
    switch (item.type) {
      case 'addProduct':
        $navigateTo(instance,item.path)
        break;
    
      default:
        break;
    }
  }

  onMounted(() =>{

  })
</script>

<style lang="scss" scoped>
  .container{
    .top-box{
      position: relative;
      .home-bg{
        width: 702rpx;
        height: 324rpx;
        margin: 24rpx;
      }
      .card-box{
        width: 702rpx;
        height: 324rpx;
        position: absolute;
        top: 24rpx;
        left: 24rpx;
        z-index: 10;
        .total-amount{
          height:128rpx;
          margin: 40rpx;
          .title{
            font-size: 28rpx;
            color: #FFFFFF;
            line-height: 40rpx;
          }
          .value{
            font-size: 64rpx;
            color: #FFFFFF;
            line-height: 64rpx;
          }
        }
        .cell-month{
          margin: 6rpx 0rpx 34rpx 0rpx;
          display: flex;
          .cell-box{
            width: 234rpx;
            height: 76rpx;
            .warning-value{
              color: #f0ad4e;
              font-size: 32rpx;
              line-height: 32rpx;
            }
            .cell-value{
              font-size: 32rpx;
              color: #FFFFFF;
              line-height: 32rpx;
            }
            .cell-sub-title{
              font-size: 24rpx;
              color: #FFFFFF;
              line-height: 32rpx;
              opacity: 0.6;
            }
          }
        }
      }
    }
    .utils-box{
      margin: 0rpx 24rpx 24rpx 24rpx;
      background: #fff;
      border-radius: 16rpx;
      .utils-title{
        padding: 30rpx 30rpx 0rpx 30rpx;
        font-weight: 600;
        font-size: 32rpx;
        color: rgba(0,0,0,0.9);
        line-height: 44rpx;
      }
      .utils-content{ 
        padding: 40rpx;
        display: flex;
        flex-wrap: wrap;
        .util-item{
          width: 50%;
          display:inline-block;
          text-align: center;
          padding-bottom: 30rpx;
          .util-item-icon{
            width: 176rpx;
            height: 176rpx;
          }
          .util-item-title{
            font-size: 36rpx;
            color: #333333;
            line-height: 44rpx;
          }
        }
      }
    }
  }
</style>
