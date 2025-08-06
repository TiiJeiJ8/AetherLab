const { defineConfig } = require('@vue/cli-service');
const port = 8080; // 端口配置

module.exports = defineConfig({
  devServer: {
    historyApiFallback: true, // 解决前端路由刷新404问题
    port, // 设置端口
  },
  transpileDependencies: true,
  publicPath: './', // 修改目录
  outputDir: 'dist', // 构建文件目录
  assetsDir: 'assets', // 静态资源目录
  filenameHashing: true, // 文件名包含hash
  runtimeCompiler: false, // 是否使用运行时编译器
  productionSourceMap: true, // 生产环境source map
  chainWebpack: config => {
    // 修复Vue特性标志警告
    config.plugin('define').tap(definitions => {
      Object.assign(definitions[0]['process.env'], {
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false)
      })
      return definitions
    })
  }
});