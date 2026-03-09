import {uploadFileFunction} from '../uploadFile.js'
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
  updateAudioFileApi
}