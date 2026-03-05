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
    // 2. 获取前端传递的手机号
    const { phone } = event

    // 3. 校验手机号（前端+云函数双重校验，避免脏数据）
    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      return {
        code: 400,
        msg: '手机号格式错误（请输入11位有效手机号）',
        data: null
      }
    }

    // 4. 查询用户是否已存在（用openId作为唯一键）
    const userRes = await db.collection('users')
      .where({ openId })
      .get()

    let result
    if (userRes.data.length > 0) {
      // 4.1 已存在：更新手机号
      const userId = userRes.data[0]._id
      result = await db.collection('users').doc(userId).update({
        data: {
          phone, // 更新手机号
          updateTime: db.serverDate() // 记录更新时间
        }
      })
    } else {
      // 4.2 不存在：创建新用户
      result = await db.collection('users').add({
        data: {
          openId, // 存储openId
          phone, // 存储手机号
          createTime: db.serverDate(), // 服务器创建时间
          updateTime: db.serverDate() // 服务器更新时间
        }
      })
    }

    // 5. 返回成功结果
    return {
      code: 1,
      msg: userRes.data.length > 0 ? '手机号更新成功' : '用户信息保存成功',
      data: {
        openId,
        phone,
        recordId: result._id // 数据库记录ID
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