/**
 * 时间格式转换工具方法
 * @param {Number|String|Date} time - 待转换的时间（时间戳/日期字符串/Date对象）
 * @param {String} format - 目标格式，默认 'YYYY-MM-DD HH:mm:ss'
 * @returns {String} 格式化后的时间字符串（无效时间返回空）
 * 格式说明：
 * YYYY - 4位年 | MM - 2位月 | DD - 2位日
 * HH - 2位时 | mm - 2位分 | ss - 2位秒 | ms - 3位毫秒
 * M  - 1位月  | D  - 1位日  | H  - 1位时  | m  - 1位分  | s  - 1位秒
 */
const formatTime =(time, format = 'YYYY-MM-DD HH:mm:ss') =>{
  // 1. 空值/无效值处理
  if (!time) return '';

  // 2. 统一转换为 Date 对象
  let date;
  if (time instanceof Date) {
    date = time;
  } else if (typeof time === 'number') {
    // 兼容 10 位（秒）和 13 位（毫秒）时间戳
    date = new Date(time.toString().length === 10 ? time * 1000 : time);
  } else {
    // 处理日期字符串（如 '2026-03-10'、'2026/03/10'）
    date = new Date(time);
  }

  // 3. 校验 Date 有效性
  if (isNaN(date.getTime())) {
    console.warn('formatTime: 无效的时间格式 ->', time);
    return '';
  }

  // 4. 补零工具函数
  const padZero = (num, length = 2) => num.toString().padStart(length, '0');

  // 5. 时间字段映射
  const timeObj = {
    YYYY: date.getFullYear(),
    MM: padZero(date.getMonth() + 1), // 月份从 0 开始
    M: date.getMonth() + 1,
    DD: padZero(date.getDate()),
    D: date.getDate(),
    HH: padZero(date.getHours()),
    H: date.getHours(),
    mm: padZero(date.getMinutes()),
    m: date.getMinutes(),
    ss: padZero(date.getSeconds()),
    s: date.getSeconds(),
    ms: padZero(date.getMilliseconds(), 3)
  };

  // 6. 替换格式模板
  return format.replace(/YYYY|MM|M|DD|D|HH|H|mm|m|ss|s|ms/g, key => timeObj[key]);
}

export {
  formatTime
}