import {callCloudFunction} from './callCloudFetch.js'

import customerApi from './customer'

const getUserInfoApi = (data) =>{
  return callCloudFunction({
    name: 'getUserInfo',
    data,
  });
}


export default {
  getUserInfoApi,
  ...customerApi
}