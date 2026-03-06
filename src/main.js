
import { createSSRApp } from 'vue'; // uni-app 推荐使用 createSSRApp 保证多端兼容
import App from "./App.vue"
// 引入工具类
import {_showToast} from './utils/util.js';
import pinia from './stores'

export function createApp() {
	const app = createSSRApp(App);

  // 2. 挂载全局工具类（替代 Vue2 的 Vue.prototype）
  app.config.globalProperties.$toast = _showToast;
  app.use(pinia)
	return {
		app,
    pinia
	};
}
