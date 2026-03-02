// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext()
    const data =  {
      event,
      openid: wxContext.OPENID,
      appid: wxContext.APPID,
      unionid: wxContext.UNIONID,
    }
    return {
      code: 1,
      msg: '操作成功',
      data: data
    }
  } catch (error) {
    return {
      code: 500,
      msg: '服务器错误，查询失败',
      data: null
    }
  }
}