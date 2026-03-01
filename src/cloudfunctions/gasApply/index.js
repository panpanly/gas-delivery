// 云函数入口文件
const cloud = require('wx-server-sdk')
// 初始化云开发
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 示例：返回用户openid和传递的参数
  return {
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    data: event.data // 前端传递的参数
  }
}