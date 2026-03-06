// cloudfunctions/saveUserInfo/index.js
const cloud = require('wx-server-sdk')

// 初始化云开发（动态环境）
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 1. 自动获取用户openId（云函数内置，无需前端传）
    const wxContext = cloud.getWXContext()
    const openId = wxContext.OPENID

    // 4. 查询用户是否已存在（用openId作为唯一键）
    const userRes = await db.collection('users')
      .where({ openId })
      .get()

    // 5. 返回成功结果
    const phone = userRes.data.length > 0 ? userRes.data[0].phone: ''
    const _id = userRes.data.length > 0 ? userRes.data[0]._id : ''
    return {
      code: 1,
      msg: '操作成功',
      data: {
        openid:openId,
        phone:phone,
        id: _id // 数据库记录ID
      }
    }
  } catch (err) {
    console.error('保存用户信息失败：', err)
    return {
      code: 500,
      msg: '服务器错误，保存失败',
      data: null,
      error: err.message
    }
  }
}