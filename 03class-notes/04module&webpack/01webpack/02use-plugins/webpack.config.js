const path = require("path")
const {
  CleanWebpackPlugin,
} = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")

// 实现对于dist/bundle.js前面

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	//var __webpack_module_cache__ = {};
/******/ 	
/******/ 	/
// 内容的去除

class MyPlugin {

  // 要求plugins要么是一个函数，要么是一个包含apply方法的对象
  apply(compiler) {
    console.log("MyPlugin 启动")

    compiler.hooks.emit.tap("MyPlugin", (compilation) => {
      // compilation => 可以理解为此次打包的上下文
      for (const name in compilation.assets) {
        // console.log(name)
        // console.log(compilation.assets[name].source())
        if (name.endsWith(".js")) {
          const contents = compilation.assets[name].source()
          const withoutComments = contents.replace(
            /\/\*\*+\*\//g,
            ""
          )
          compilation.assets[name] = {
            source: () => withoutComments,
            size: () => withoutComments.length,
          }
        }
      }
    })
  }
}

module.exports = {
  mode: "none",
  entry: "./src/main.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
    // publicPath: 'dist/'
  },
  module: {
    rules: [
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
      title: "Webpack Plugin Sample",
      meta: {
        viewport: "width=device-width",
      },
      template: "./src/index.html",
      favicon: "public/favicon.ico",
    }),
    // 用于生成 about.html
    new HtmlWebpackPlugin({
      filename: "about.html",
    }),
    new CopyWebpackPlugin([
      // 'public/**'
      "public",
    ]),
    new MyPlugin()
  ],
}
