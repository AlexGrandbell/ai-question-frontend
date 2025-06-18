const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port:3000,
    proxy: {
      '/api': {
        target: 'http://localhost:10100',
        changeOrigin: true,
        pathRewrite: { '^/api': '/api' }
      },
      // '/chat': {
      //   target: 'http://localhost:5110',
      //   changeOrigin: true
      //   pathRewrite: { '^/chat': '/chat' }
      // }
    }
  }
})


