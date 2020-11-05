const { merge } = require("webpack-merge")
const baseConfig = require("./webpack.common.js")
const { distPath } = require("./paths")

module.exports = merge(baseConfig, {
  mode: "production",
  // source-map 会暴露源代码
  // 如果还需要调试 nosoucce-source-map 只会有位置
  devtool: "none",
})
