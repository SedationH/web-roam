const { resolve } = require("path")
const VueLoaderPlugin = require("vue-loader/lib/plugin")
const {
  CleanWebpackPlugin,
} = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { srcPath, distPath, publicPath } = require("./paths")

module.exports = {
  entry: resolve(srcPath, "main.js"),
  output: {
    filename: "[name].[hash:8].js",
    path: distPath,
  },
  resolve: {
    alias: {
      "@": srcPath //这里就将@映射到了/src/目录了，在使用时用@就行
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
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
            esModule: false,
          },
        },
      },
      {
        test: /js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.less$/,
        use: [
          "vue-style-loader",
          {
            loader: "css-loader",
            options: {
              esModule: false,
            },
          },
          "less-loader",
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(), //打包前清空输出目录
    new HtmlWebpackPlugin({
      template: resolve(publicPath, "index.html"),
      title: "MyVueConfigInit",
      url: publicPath,
    }),
    new VueLoaderPlugin(),
  ],
}
