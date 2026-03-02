import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import copy from 'rollup-plugin-copy';
import path from 'path';

// 获取环境（开发/生产），匹配uni-app的打包目录规则
const env = process.env.NODE_ENV || 'development';
// 目标目录：uni-app打包后的微信小程序目录
const targetPath = path.resolve(
  __dirname, 
  `dist/${env === 'production' ? 'build' : 'dev'}/mp-weixin/cloudfunctions`
);

export default defineConfig({
  plugins: [
    // uni-app核心插件（必须保留）
    uni(),
    // 复制cloudfunctions文件夹的插件
    copy({
      // 复制的源文件/目录
      targets: [
        {
          src: path.resolve(__dirname, 'cloudfunctions/**/*'), // 匹配cloudfunctions下所有文件
          dest: targetPath, // 目标目录
        },
      ],
      // 关键配置：确保每次打包都重新复制（覆盖旧文件）
      overwrite: true,
      // 开发环境下实时监听cloudfunctions变化并复制（可选，开发更便捷）
      watch: env === 'development' ? {
        include: 'cloudfunctions/**/*',
        exclude: 'cloudfunctions/**/node_modules/**' // 忽略node_modules，减少复制耗时
      } : false,
    }),
  ],
  // 可选：解决路径别名等其他问题（非必须，根据你的项目补充）
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});