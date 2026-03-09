import {callCloudFunction} from '../callCloudFetch.js'

/**
 * 获取用户信息
 * @param {*} data 
 * @returns 
 */
const getUserInfoApi = (data) =>{
  return callCloudFunction({
    name: 'getUserInfo',
    data,
  });
}

/**
 * 更新用户信息
 * @param {*} data 
 * @returns 
 */
const updateUserInfoApi = (data) =>{
  return callCloudFunction({
    name: 'updateUserInfo',
    data,
  });
}

export default {
  getUserInfoApi,
  updateUserInfoApi
}