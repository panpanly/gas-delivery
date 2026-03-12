/**
 * 微信小程序页面跳转工具类（修复 proxy 为 null 问题）
 * 适配 Vue3 + uni-app，解决页面栈过深 + webview 处理
 */

// 微信小程序页面栈最大深度
const MAX_PAGE_STACK = 10
// webview 页面路径（根据你的项目修改）
const WEBVIEW_PAGE_PATH = '/pages/webview/webview'

/**
 * 获取当前页面栈信息（修复核心：从组件传入实例）
 * @param {Object} instance 组件实例（getCurrentInstance() 返回值）
 * @returns {Array} 页面栈数组
 */
const getPageStack = (instance) => {
  // 兼容 uni-app 获取页面栈的正确方式
  if (typeof uni !== 'undefined' && uni.getSystemInfoSync) {
    return getCurrentPages() // 直接用小程序原生 API，无需依赖组件实例
  }
  // 兜底：兼容特殊场景
  return instance?.proxy?.$mp?.page ? [instance.proxy.$mp.page] : []
}

/**
 * 基础跳转方法（处理页面栈过深）
 * @param {Object} instance 组件实例（必须传）
 * @param {String} type 跳转类型
 * @param {String} url 目标路径
 * @param {Object} params 参数
 * @param {Boolean} isWebview 是否跳转到webview
 */
const navigate = (instance, type, url, params = {}, isWebview = false) => {
  try {
    // 校验实例是否有效
    if (!instance) {
      console.error('跳转失败：请传入组件实例（getCurrentInstance() 返回值）')
      uni.showToast({ title: '跳转失败', icon: 'none' })
      return
    }

    // 1. 处理webview跳转
    let targetUrl = url
    if (isWebview) {
      params.url = url
      targetUrl = WEBVIEW_PAGE_PATH
    }

    // 2. 拼接参数
    const query = Object.entries(params)
      .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
      .join('&')
    const fullUrl = query ? `${targetUrl}?${query}` : targetUrl

    // 3. 获取页面栈深度（改用小程序原生 API getCurrentPages()）
    const pageStack = getPageStack(instance)
    const currentStackLength = pageStack.length

    // 4. 处理页面栈过深
    let finalType = type
    if (currentStackLength >= MAX_PAGE_STACK - 1) {
      console.warn(`页面栈深度${currentStackLength}接近上限，自动切换为reLaunch`)
      finalType = 'reLaunch'
    }

    // 5. 执行跳转
    switch (finalType) {
      case 'navigateTo':
        uni.navigateTo({ url: fullUrl })
        break
      case 'redirectTo':
        uni.redirectTo({ url: fullUrl })
        break
      case 'switchTab':
        uni.switchTab({ url: fullUrl })
        break
      case 'reLaunch':
        uni.reLaunch({ url: fullUrl })
        break
      default:
        uni.navigateTo({ url: fullUrl })
    }
  } catch (error) {
    console.error('页面跳转失败：', error)
    uni.showToast({ title: '跳转失败，请重试', icon: 'none' })
  }
}

/**
 * 保留当前页面跳转（需传入组件实例）
 * @param {Object} instance 组件实例
 * @param {String} url 目标路径
 * @param {Object} params 参数
 * @param {Boolean} isWebview 是否跳转到webview
 */
export const $navigateTo = (instance, url, params = {}, isWebview = false) => {
  navigate(instance, 'navigateTo', url, params, isWebview)
}

/**
 * 关闭当前页面跳转
 * @param {Object} instance 组件实例
 * @param {String} url 目标路径
 * @param {Object} params 参数
 * @param {Boolean} isWebview 是否跳转到webview
 */
export const $redirectTo = (instance, url, params = {}, isWebview = false) => {
  navigate(instance, 'redirectTo', url, params, isWebview)
}

/**
 * 跳转到tabBar页面
 * @param {Object} instance 组件实例
 * @param {String} url 目标路径
 * @param {Object} params 参数
 */
export const $switchTab = (instance, url, params = {}) => {
  navigate(instance, 'switchTab', url, params)
}

/**
 * 关闭所有页面跳转
 * @param {Object} instance 组件实例
 * @param {String} url 目标路径
 * @param {Object} params 参数
 * @param {Boolean} isWebview 是否跳转到webview
 */
export const $reLaunch = (instance, url, params = {}, isWebview = false) => {
  navigate(instance, 'reLaunch', url, params, isWebview)
}

/**
 * 页面返回（兼容webview）
 */
export const $navigateBack = (delta = 1) => {
  try {
    // 直接用小程序原生 API 获取页面栈，无需依赖组件实例
    const pageStack = getCurrentPages()
    const currentPage = pageStack[pageStack.length - 1]
    
    // 处理webview返回
    if (currentPage?.route === WEBVIEW_PAGE_PATH.replace(/^\//, '')) {
      uni.navigateBack({ delta: 1 })
      return
    }

    // 处理返回层数超限
    const realDelta = Math.min(delta, pageStack.length - 1)
    if (realDelta <= 0) {
      console.warn('已到页面栈最顶层，无法返回')
      return
    }

    uni.navigateBack({ delta: realDelta })
  } catch (error) {
    console.error('页面返回失败：', error)
    uni.showToast({ title: '返回失败，请重试', icon: 'none' })
  }
}

/**
 * 跳转到webview页面（专用方法）
 * @param {Object} instance 组件实例
 * @param {String} webUrl H5链接
 * @param {Object} params 额外参数
 */
export const toWebview = (instance, webUrl, params = {}) => {
  navigateTo(instance, '', { ...params, webUrl }, true)
}

// 导出所有方法
export default {
  $navigateTo,
  $redirectTo,
  $switchTab,
  $reLaunch,
  $navigateBack,
  toWebview
}