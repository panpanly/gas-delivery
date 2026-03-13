<template>
  <div class="container">
    <view class="top-body flex-row-center">
      <view class="upload-box flex-column-center" :class="{
        'fail-border':imageValidateFail
      }" @tap="handleUpload">
        <image class="image-upload" src="../../static/images/icon-upload.png" />
        <view class="upload-text" :class="{
          'fail-text':imageValidateFail
        }">点击此处，上传图片</view>
      </view>
    </view>
    <view class="content">
      <uni-forms ref="formRef" :rules="state.rules" :modelValue="formData" label-position="top">
        <uni-forms-item label-width="120" label="商品名称：" required name="productName">
          <uni-easyinput v-model="state.formData.productName" placeholder="请输入商品名称" max-length="50" placeholder-style="font-size:36rpx" />
        </uni-forms-item>
        <uni-forms-item label-width="120" label="商品价格：" required name="productPrice">
          <uni-easyinput v-model="state.formData.productPrice" placeholder="请输入商品价格" placeholder-style="font-size:36rpx" />
        </uni-forms-item>
        <uni-forms-item label-width="120" label="商品描述：" name="introduction">
          <uni-easyinput type="textarea" v-model="state.formData.introduction" placeholder="请输入商品描述" max-length="300" placeholder-style="font-size:36rpx" />
        </uni-forms-item>
      </uni-forms>
    </view>
    <view class="handle-body">
      <view class="btn flex-row-center" @tap="handleSubmit">提交</view>
    </view>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, toRefs, getCurrentInstance } from 'vue';

  const instance = getCurrentInstance()
  const imageValidateFail = ref(false);
  const state = reactive({
    rules:{
      productName:{
        rules:[
          {
            required:true,
					  errorMessage:'商品名称不能为空'
          }
        ]
      },
      productPrice:{
        rules:[
          {
            required:true,
					  errorMessage:'商品价格不能为空'
          }
        ]
      },
    },
    formData:{
      productImage:'',
      productName:'',
      productPrice:'',
      introduction:'',
    },
  })

  /** 上传图片 */
  const handleUpload = () =>{
    //TODO: 调用上传图片接口
  }

  /** 校验 */
  const validateFun = () =>{
    const {productImage} = state.formData || {}
    if(!productImage){
      imageValidateFail.value = true
      return false
    }
    return true 
  }

  /** 提交 */
  const handleSubmit = () =>{
    //图片校验
    const validResult = validateFun()
    if(!validResult) return 
    instance.refs.formRef.validate(valid =>{
      if(valid){
        //TODO: 调用新增商品接口
      }
    })
  }

  // 生命周期
  onMounted(() => {

  });

</script>

<style scoped lang="scss">
::v-deep .uni-forms-item__label{
  font-size: 36rpx !important;
  height: 90rpx;
  color: #0281FF;
}
::v-deep .uni-forms-item__content{
  display: flex;
  align-items: center;
  font-size: 36rpx;
}
::v-deep .is-input-border{
  padding: 20rpx 0rpx;
  border: 2rpx solid #0281FF !important;
} 
::v-deep .uni-easyinput__content-input{
  font-size: 36rpx;
}
::v-deep .uni-easyinput__content-textarea{
  font-size: 36rpx ;
}
.container {
  .top-body{
    background: #fff;
    padding: 30rpx;
    .upload-box{
      width: 320rpx;
      height: 320rpx;
      font-weight: 600;
      border-radius: 16rpx;
      border: 2rpx solid #0281FF;
      .upload-text{
        color: #0281FF;
      }
      .fail-text{
        color: #dd524d;
      }
      .image-upload{
        width: 100rpx;
        height: 100rpx;
      }
    }
    .fail-border{
      border: 2rpx solid #dd524d;
    }
  }

  .content{
    margin: 30rpx 0rpx;
    background: #fff;
    padding: 30rpx 24rpx 0rpx 24rpx;
    height: calc(100vh - 192px - 100px - 45px);
    overflow: auto;
  }

  .handle-body{
    position: fixed;
    bottom: 0;
    z-index: 10;
    width: 100%;
    background: #fff;
    padding-bottom: 60rpx;
    .btn{
      height: 80rpx;
      font-size: 36rpx;
      color: #fff;
      background: #0281FF;
      border-radius: 12rpx;
      margin: 30rpx 24rpx;
    }
  }
}
</style>
