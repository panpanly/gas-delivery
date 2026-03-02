/**
 * 全局工具类
 * 包含：统一提示、防抖、节流等常用方法
 */

/**
 * 统一封装 showToast 提示
 * @param {String} title 提示文本
 * @param {String} icon 图标（success/loading/error/none，默认none）
 * @param {Number} duration 显示时长（默认2000ms）
 * @param {Boolean} mask 是否显示透明蒙层（默认false）
 */
const _showToast = (title, icon = 'none', duration = 2000, mask = false) => {
  // 先关闭可能存在的提示，避免重复触发
  uni.hideToast();
  return uni.showToast({
    title,
    icon,
    duration,
    mask
  });
};

/**
 * 防抖函数（触发后延迟执行，重复触发重置延迟）
 * @param {Function} fn 要防抖的函数
 * @param {Number} delay 延迟时间（ms，默认500ms）
 * @param {Boolean} immediate 是否立即执行（默认false）
 * @returns {Function} 防抖后的函数
 */
const _debounce = (fn, delay = 500, immediate = false) => {
  let timer = null;
  return function (...args) {
    // 清除之前的定时器
    if (timer) clearTimeout(timer);
    
    // 立即执行：第一次触发时直接执行，后续触发等待延迟
    if (immediate && !timer) {
      fn.apply(this, args);
    }
    
    // 重置定时器
    timer = setTimeout(() => {
      if (!immediate) {
        fn.apply(this, args);
      }
      timer = null;
    }, delay);
  };
};

/**
 * 节流函数（固定时间内只执行一次）
 * @param {Function} fn 要节流的函数
 * @param {Number} interval 间隔时间（ms，默认500ms）
 * @returns {Function} 节流后的函数
 */
const _throttle = (fn, interval = 500) => {
  let lastTime = 0; // 上一次执行时间
  return function (...args) {
    const now = Date.now();
    // 距离上次执行时间超过间隔，才执行
    if (now - lastTime >= interval) {
      fn.apply(this, args);
      lastTime = now;
    }
  };
};

/**
 * 扩展：封装 showLoading 加载提示
 * @param {String} title 加载文本（默认"加载中..."）
 * @param {Boolean} mask 是否显示蒙层（默认true）
 */
const _showLoading = (title = '加载中...', mask = true) => {
  uni.hideLoading();
  return uni.showLoading({ title, mask });
};

/**
 * 扩展：封装 hideLoading 关闭加载提示
 */
const _hideLoading = () => {
  uni.hideLoading();
};

// 导出所有工具方法（统一入口）
export {
  _showToast,
  _debounce,
  _throttle,
  _showLoading,
  _hideLoading
};