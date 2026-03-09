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

/**
 * 获取申请记录
 */
const fetchApplyList = (data) =>{
  return callCloudFunction({
    name:'getApplyList',
    data,
  })
}

export default {
  addApplyRecord,
  fetchApplyList
}