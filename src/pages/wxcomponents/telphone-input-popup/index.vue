<template>
  <view class="telphone-popup-body">
    <view class="close-box" @tap="closePopup">
      <image class="icon-close" src="@/static/images/icon-popup-close.png" />
    </view>
    <uni-forms ref="valiFormRef" :rules="state.rules" :modelValue="state.valiFormData">
      <uni-forms-item class="phone-item" label="手机号" label-width="100" required name="phone">
        <!-- <input class="input" type="number" v-model="state.valiFormData.phone" placeholder="请输入您的手机号" placeholder-style="font-size:36rpx" /> -->
        <uni-easyinput class="input" type="number" v-model="state.valiFormData.phone" placeholder="请输入您的手机号" placeholder-style="font-size:36rpx" />
      </uni-forms-item>
    </uni-forms>
    <button class="submit-btn flex-row-center" @tap="submit('valiForm')">提交</button>
  </view>
</template>

<script setup>
  import {onMounted, reactive, toRefs, getCurrentInstance} from 'vue'
  import apis from '@/apis/index.js'

  const app = getApp();
  const instance = getCurrentInstance()
  const $emit = defineEmits(['closePopup','submit'])

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
      }
    },
    valiFormData:{
      phone:'',
    },
  })

  /**
   * 提交
   */
  const submit = () =>{
    instance.refs.valiFormRef.validate().then(valid =>{
      if(valid){
        updateUserInfo();
      }
    }).catch(err =>{
      console.log('表单错误信息：', err);
    })
  }

  /** 更新用户信息 */
  const updateUserInfo = async () =>{
    const {phone} = state.valiFormData || {}
    const res = await apis.updateUserInfoApi({phone});
    if(res.code === 1){
      app.globalData.userInfo.phone = res?.data?.phone || ''
      $emit('submit',{...res.data})
    }
  }

  /**
   * 关闭弹窗
   */
  const closePopup = () =>{
    instance.refs.valiFormRef.clearValidate()
    $emit('closePopup',false)
  }

  onMounted(() =>{
    //定义校验规则
    instance.refs.valiFormRef.setRules(state.rules)
  })

</script>

<style lang="scss" scoped>

  .telphone-popup-body{
    background: #fff;
    width: 642rpx;
    margin: 0 auto;
    padding: 60rpx 30rpx;
    border-radius: 16rpx;
    position: relative;

    .close-box{
      width:80rpx;
      height: 80rpx;
      position: absolute;
      bottom: -130rpx;
      left: 311rpx;
      .icon-close{
        width: 100%;
        height: 100%;
      }
    }
    .submit-btn{
      height: 100rpx;
      font-size: 40rpx;
      background: $uni-color-success;
      color: #fff;
    }
  }
</style>
