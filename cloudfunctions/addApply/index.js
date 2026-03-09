// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const {userPhone, userId, fileIds} = event || {}
    //保存数据。
    let result = await db.collection('apply_list').add({
      data: {
        userPhone,
        userId, 
        fileIds,
        createTime: db.serverDate(), // 服务器创建时间
        updateTime: db.serverDate() // 服务器更新时间
      }
    })
    //返回成功结果
    return {
      code: 1,
      msg: '保存成功',
      data: {
        id: result._id // 数据库记录ID
      }
    }
  } catch (err) {
    return {
      code: 500,
      msg: '服务器错误，保存失败',
      data: null,
      error: err.message
    }
  }
}