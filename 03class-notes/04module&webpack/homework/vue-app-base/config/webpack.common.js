const path = require("path")

const VueLoaderPlugin = require("vue-loader/lib/plugin")

const htmlWebpackPlugin = require("html-webpack-plugin")

const { CleanWebpackPlugin } = require("clean-webpack-plugin")

const webpack = require("webpack")

module.exports = {
  mode: "development",
  entry: "./src/main.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(png|jpg|gif|ttf)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10 * 1024,
            esModule: false,
          },
        },
      },
      {
        test: /\.less/, //处理.less文件
        loader: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /.js$/, //将.js文件中的es6语法转换成es5语法

        loader: "babel-loader",
        exclude: /node_modules/, //nodejs依赖库中的js文件全部都不需要进行转换
      },
      {
        test: /.css$/,
        loader: ["style-loader", "css-loader"],
      },
      {
        test: /.html$/,
        loader: ["html-loader"],
      },

      {
        test: /\.vue$/,
        use: "vue-loader",
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin(),

    new CleanWebpackPlugin(),

    new htmlWebpackPlugin({
      //生成引用bundle.js的HTML

      title: "this is Vue",

      filename: "index.html",

      template: "./public/index.html",
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
}
