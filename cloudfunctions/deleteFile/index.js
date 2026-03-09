// 初始化云环境（需替换为你的云环境 ID）
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })

exports.main = async (event, context) => {
  try {
    // 1. 获取前端传入的文件 ID/文件路径（fileID 是微信云存储的唯一标识）
    const { fileID } = event
    
    if (!fileID) {
      return {
        code: -1,
        msg: '文件 ID 不能为空',
        data: null
      }
    }

    // 2. 调用微信云存储 API 删除文件
    const result = await cloud.deleteFile({
      fileList: [fileID] // 支持批量删除，传入数组即可
    })

    // 3. 校验删除结果（fileList 中 fail 数组为空则删除成功）
    if (result.fileList[0].status === 'success') {
      return {
        code: 0,
        msg: '文件删除成功',
        data: result.fileList
      }
    } else {
      return {
        code: -2,
        msg: `删除失败：${result.fileList[0].errMsg}`,
        data: null
      }
    }
  } catch (error) {
    console.error('删除文件异常：', error)
    return {
      code: -99,
      msg: `服务器异常：${error.message}`,
      data: null
    }
  }
}