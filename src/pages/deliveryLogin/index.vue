<template>
  <view class="content">
    <image 
      class="home-bg"
      :src="imageUrl"
      mode="scaleToFill"
    />
    <view class="login-body">
      <view class="title flex-row-center">登录</view>
      <view class="login-form-box">
        <uni-forms ref="formRef" :rules="state.rules" :modelValue="state.formData">
          <uni-forms-item class="phone-item" label="账号" label-width="100" required name="phone">
            <uni-easyinput class="input" v-model="state.formData.phone" placeholder="请输入您的手机号" placeholder-style="font-size:36rpx" />
          </uni-forms-item>
          <uni-forms-item class="phone-item" label="密码" label-width="100" required name="password">
            <uni-easyinput class="input" type="password" v-model="state.formData.password" placeholder="请输入账号密码" placeholder-style="font-size:36rpx" />
          </uni-forms-item>
        </uni-forms>
        <button class="submit-btn flex-row-center" @tap="handleLogin()">登录</button>
      </view>
    </view>
  </view>
</template>

<script setup>
  import {getCloudFileUrl} from '@/utils/cloud.js'
  import {ref, onMounted, reactive, getCurrentInstance} from 'vue'

  const instance = getCurrentInstance()
  const imageUrl = ref('');
  const state = reactive({
    rules:{
      phone:{
        rules: [{
						required: true,
						errorMessage: '请输入您的手机号',
					},{
						validateFunction:function(rule,value,data,callback){
							if (!/^1[3-9]\d{9}$/.test(value)) {
								callback('手机号格式错误（请输入11位有效手机号）')
							}
							return true
						}
					}]
      },
      password:{
        rules:[{
          required: true,
					errorMessage: '请输入您的账号密码',
        }]
      }
    },
    formData:{
      phone:'',
      password:'',
    },
  })
  /** 更新首页背景图 */
  const updateImageUrl = () =>{
    getCloudFileUrl('cloud://cloud1-4g8i7f3ofd6fe36d.636c-cloud1-4g8i7f3ofd6fe36d-1407373655/images/gas-home-bg.png').then(url => {
      imageUrl.value = url;
    });
  }

  /** 登录 */
  const handleLogin = () =>{
    instance.refs.formRef.validate().then(valid =>{
      if(valid){

      }
    })
  }

  onMounted(() =>{
    //获取首页背景图
    updateImageUrl();
    //定义校验规则
    instance.refs.formRef.setRules(state.rules)
  })
</script>

<style lang="scss" scoped>
  ::v-deep .uni-forms-item {
    padding: 0rpx 20rpx;
    border: 2rpx solid #333;
    border-radius: 20rpx;
  }
  ::v-deep .uni-forms-item__label{
    font-size: 36rpx !important;
    height: 114rpx;
  }
  ::v-deep .uni-forms-item__content{
    display: flex;
    align-items: center;
    font-size: 36rpx;
  }
  ::v-deep .is-input-border{
    padding: 20rpx 0rpx;
    border: 2rpx solid transparent !important;
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

  .login-body{
    width: 702rpx;
    margin: 0rpx 24rpx;
    height: auto;
    border-radius: 25rpx;
    background: #fff;
    opacity: 0.9;
    position: absolute;
    top: 30%;
    left: 0;
    z-index:10;
    .title{
      padding: 20rpx;
      font-size: 40rpx;
      color: #333;
    }
    .login-form-box{
      padding: 30rpx 24rpx 50rpx;
    }
    .submit-btn{
      background: $uni-color-primary;
      color: #fff;
      height: 100rpx;
    }
  }
</style>
