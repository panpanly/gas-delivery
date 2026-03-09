
import { createSSRApp } from 'vue'; // uni-app 推荐使用 createSSRApp 保证多端兼容
import App from "./App.vue"
// 引入工具类
import pinia from './stores'

export function createApp() {
	const app = createSSRApp(App);

  app.use(pinia)
	return {
		app,
    pinia
	};
}
