const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  devtool: 'cheap-module-eval-source-map',
  plugins: [
    new HtmlWebpackPlugin()
  ]
}