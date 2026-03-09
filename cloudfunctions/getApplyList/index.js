const cloud = require('wx-server-sdk')
// 初始化云环境（替换为你的云环境ID）
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command // 数据库操作符

/** 音频文件数据处理 */
const fileConverter = async (list = []) =>{
  if(!list.length) return []
  //根据文件Id查询文件数据
  try {
    // 最终返回的文件列表集合
    let finalFileList = []
    // 文件Id集合
    const fileList = list.map(item =>{
      return item.fileId
    })
    //批量获取文件数据
    const fileInfoArr = await cloud.getTempFileURL({
      fileList: fileList
    })
    list.forEach((fItem,fIndex) =>{
      const fileInfo = fileInfoArr[fIndex]
      finalFileList.push({
        userId:fItem.userId,
        fileUrl:fileInfo.tempFileURL,
        fileId:fileInfo.fileId
      })
    })
    return finalFileList
  } catch (error) {
    console.warn(`读取文件失败`, fileError)
    return []
  }
}

/** 返回数据结构重组 */
const dataConverter = async (list = []) =>{
  if(!list.length) return []
  try {
    let finalData = []
    for (const item of list) {
      //返回的基础数据
      const basicData = {
        id: item._id,
        createTime: item.createTime,
        updateTime:item.updateTime,
        updateTime:item.updateTime,
        userPhone:item.userPhone,
        fileIds:item.fileIds,
      }
      //返回录音文件数据
      const fileIds = item.fileIds || []
      const fileInfoList = await fileConverter(fileIds)
      basicData.fileInfoList = fileInfoList
      finalData.push(basicData)
    }
    return finalData
  } catch (error) {
    return []
  }
}

/**
 * 按月份筛选数据
 * @param {Number} year 年份
 * @param {Number} month 月份
 * @returns {Array} 符合条件的数据
 */
exports.main = async (event, context) => {
  debugger
  try {
    // 1. 获取前端传入的年月（默认当前年月）
    const {date, userId} = event
    const [year = '', month = ''] = date?.split('-');
    let targetY = year
    let targetM = month
    if(!date || !year || !month) {
      targetY = new Date().getFullYear()
      targetM = new Date().getMonth() + 1
    }

    // 3. 计算当月的开始/结束时间戳（毫秒）
    // 开始时间：当月1日 00:00:00
    const startDate = new Date(year, month - 1, 1) // month-1是因为JS月份从0开始
    // 结束时间：当月最后1日 23:59:59
    const endDate = new Date(year, month, 0, 23, 59, 59)

    // 4. 转换为微信云数据库的时间格式（兼容Date对象/时间戳）
    const startTime = db.serverDate({
      date: startDate.getTime()
    })
    const endTime = db.serverDate({
      date: endDate.getTime()
    })

    // 5. 筛选数据（替换为你的集合名，如：order、user_data）
    const result = await db.collection('apply_list')
      .where({
        // createTime 是你的数据创建时间字段，需替换为实际字段名
        createTime: _.and(
          _.gte(startTime), // 大于等于开始时间
          _.lte(endTime)    // 小于等于结束时间
        )
      }).where({
        userId:userId
      })
      .orderBy('createTime', 'desc') // 按创建时间倒序
      .get()
    
    // 6. 根据查询结果重新组装数据
    const list = result.data || []
    const datalist = await dataConverter(list)
    // 7. 返回组装后的数据
    return {
      code: 1,
      msg: `操作成功`,
      data: datalist
    }
  } catch (error) {
    return {
      code: 500,
      msg: `服务器异常`,
      data: null
    }
  }
}