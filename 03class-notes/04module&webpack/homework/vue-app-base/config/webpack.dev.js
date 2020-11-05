const { merge } = require("webpack-merge")
const baseConfig = require("./webpack.common.js")
const { distPath } = require("./paths")

module.exports = merge(baseConfig, {
  mode: "development",
  devtool: "eval-cheap-module-source-map",
  devServer: {
    // webpack-dev-serve 存于内存，不需要contentBase
    // contentBase: distPath,
    hot: true,
    port: 9000,
    open: true,
  },
})
