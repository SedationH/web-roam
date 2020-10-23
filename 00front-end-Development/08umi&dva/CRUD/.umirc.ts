import { defineConfig } from 'umi'

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  // 使用proxy解决跨域问题 只在调试的时候好用
  proxy: {
    '/api': {
      target: 'http://public-api-v1.aspirantzhang.com',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
})
