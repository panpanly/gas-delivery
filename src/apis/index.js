import {callCloudFunction} from './callCloudFetch.js'
import {uploadFileFunction} from './uploadFile.js'

import customerApi from './customer'

const getUserInfoApi = (data) =>{
  return callCloudFunction({
    name: 'getUserInfo',
    data,
  });
}

/**
 * 录音文件上传
 * @param {*} data 
 * @returns 
 */
const updateAudioFileApi = (data) =>{
  return uploadFileFunction({
    cloudPath:data.cloudPath,
    filePath:data.filePath
  })
}


export default {
  getUserInfoApi,
  updateAudioFileApi,
  ...customerApi
}