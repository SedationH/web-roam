const path = require("path")
const { CleanWebpackPlugin } = require("clean-webpack-plugin/src/clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const webpack = require("webpack")

module.exports = {
  devtool: "eval-cheap-module-source-map",
  mode: "none",
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
  },
  devServer: {
    // HMR
    hot: true,
    contentBase: "./public",
    proxy: {
      "/api": {
        // http://localhost:8080/api/users -> https://api.github.com/api/users
        target: "https://api.github.com",
        // http://localhost:8080/api/users -> https://api.github.com/users
        pathRewrite: {
          "^/api": "",
        },
        // 不能使用 localhost:8080 作为请求 GitHub 的主机名
        changeOrigin: true,
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /.png$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10 * 1024, // 10 KB
          },
        },
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    // 用于生成 index.html
    new HtmlWebpackPlugin({
      title: "Webpack Tutorials",
      meta: {
        viewport: "width=device-width",
      },
      template: "./src/index.html",
    }),
    new webpack.HotModuleReplacementPlugin(),
    // // 开发阶段最好不要使用这个插件
    // new CopyWebpackPlugin(['public'])
  ],
}
