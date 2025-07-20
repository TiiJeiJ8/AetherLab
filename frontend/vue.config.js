const { defineConfig } = require('@vue/cli-service');
const port = 8080; // 端口配置

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port, // 设置端口
  },
  publicPath: './', // 修改目录
  outputDir: 'dist', // 构建文件目录
  assetsDir: 'assets', // 静态资源目录
  filenameHashing: true, // 文件名包含hash
  runtimeCompiler: false, // 是否使用运行时编译器
  productionSourceMap: true, // 生产环境source map
});