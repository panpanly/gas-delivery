import {callCloudFunction} from '../callCloudFetch.js'
import {uploadFileFunction} from '../uploadFile.js'

/**
 * 提交录音记录的快捷调用
 * @param {Object} data - 提交参数（phone, audioList）
 * @returns {Promise<Object>}
 */
const submitAudioRecords = (data) => {
  return callCloudFunction({
    name: 'submitAudioRecords',
    data,
    loadingText: '提交录音中...'
  });
};

/**
 * 查询用户录音记录的快捷调用
 * @param {Object} data - 分页参数（page, pageSize）
 * @returns {Promise<Object>}
 */
const getUserAudioRecords = (data) => {
  return callCloudFunction({
    name: 'getUserAudioRecords',
    data,
    loadingText: '加载记录中...'
  });
};

/**
 * 录音文件上传
 * @param {*} data 
 * @returns 
 */
const updateAudioFile = (data) =>{
  return uploadFileFunction({
    cloudPath:data.cloudPath,
    fileContent:data.fileContent
  })
}

export default {
  submitAudioRecords,
  getUserAudioRecords,
  updateAudioFile
}