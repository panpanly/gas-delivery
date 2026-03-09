import {callCloudFunction} from '../callCloudFetch.js'

/**
 * 新增申请记录
 * @param {*} data 
 */
const addApplyRecord = (data) =>{
  return callCloudFunction({
    name:'addApply',
    data,
  })
}

export default {
  addApplyRecord
}