import {defineStore} from 'pinia'

export const useUserStore = defineStore('user',{
  /**状态管理 */
  state:() =>({
    openid:'', //用户openid
    userPhone:'', // 用户手机号
    userId:'', //用户Id
  }),

  /** 计算属性，状态的延伸，多用于多个字段有逻辑判断的处理，可传参 */
  getters:{

  },

  /**方法，修改状态的逻辑处理，支持同步和异步 */
  actions:{
    /** 更新用户手机号 */
    updateUserInfo(userData){
      this.userPhone = userData.phone
      this.userId = userData.id
    },

    /**更新用户手机号 */
    updateUserPhone(phone){
      this.userPhone = phone ;
    },

    /** 更新openid */
    updateOpenid(openid) {
      this.openid = openid ;
    }

  },
  
})