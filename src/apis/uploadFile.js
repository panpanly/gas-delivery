/**
 * 通用云函数调用封装
 * @param {Object} options - 调用参数
 * @param {String} options.name - 云函数名称（必填）
 * @param {Object} [options.data={}] - 传递给云函数的参数（可选，默认空对象）
 * @param {String} [options.loadingText='处理中...'] - 加载提示文字（可选）
 * @param {Boolean} [options.showLoading=true] - 是否显示加载提示（可选，默认true）
 * @returns {Promise<Object>} 统一格式的返回结果
 */
export const uploadFileFunction = async ({
  cloudPath,
  fileContent,
  loadingText = '上传中，请稍后...',
  showLoading = true
}) => {
  // 1. 参数校验
  if (!name || typeof name !== 'string') {
    return {
      success: false,
      code: -1,
      msg: '云函数名称不能为空且必须为字符串',
      data: null
    };
  }

  try {
    // 2. 显示加载提示
    if (showLoading) {
      uni.showLoading({
        title: loadingText,
        mask: true // 遮罩层，防止点击穿透
      });
    }

    // 3. 调用云函数（仅在微信小程序端执行）
    // #ifdef MP-WEIXIN
    const result = await wx.cloud.uploadFile({
      cloudPath: cloudPath,
      fileContent: fileContent
    });
    debugger
    // 4. 关闭加载提示
    if (showLoading) {
      uni.hideLoading();
    }

    // 5. 处理云函数返回结果
    const res = result.result || {};
    // 云函数业务成功（约定code=200为成功）
    if (result.errMsg === 'cloud.callFunction:ok') {
      return {
        success: true,
        code: res.code,
        msg: res.msg || '操作成功',
        data: res.data || null
      };
    } else {
      // 云函数业务失败（如参数错误、数据库报错等）
      const errorMsg = res.msg || `调用${name}失败，请稍后重试`;
      // 自动提示错误信息（可根据需求关闭）
      uni.showToast({
        title: errorMsg,
        icon: 'none',
        duration: 2000
      });
      return {
        success: false,
        code: res.code || -2,
        msg: errorMsg,
        data: null
      };
    }
    // #endif

    // 非微信小程序端返回错误
    // #ifndef MP-WEIXIN
    if (showLoading) {
      uni.hideLoading();
    }
    return {
      success: false,
      code: -3,
      msg: '仅支持微信小程序端调用云函数',
      data: null
    };
    // #endif

  } catch (error) {
    // 6. 捕获异常（网络错误、云函数不存在等）
    if (showLoading) {
      uni.hideLoading();
    }

    // 标准化异常信息
    let errorMsg = '网络异常，请检查网络后重试';
    let errorCode = -4;
    if (error.message) {
      if (error.message.includes('cloud function not found')) {
        errorMsg = `云函数${name}不存在，请检查名称是否正确`;
        errorCode = -5;
      } else if (error.message.includes('login required')) {
        errorMsg = '请先登录微信后再操作';
        errorCode = -6;
      } else {
        errorMsg = error.message;
      }
    }

    // 提示用户错误信息
    uni.showToast({
      title: errorMsg,
      icon: 'none',
      duration: 2000
    });

    // 返回统一格式的错误结果
    return {
      success: false,
      code: errorCode,
      msg: errorMsg,
      data: null
    };
  }
};