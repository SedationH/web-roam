const path = require("path")
const VueLoaderPlugin = require("vue-loader/lib/plugin")
const { srcPath, publicPath, distPath } = require("./paths")
const htmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")

console.log(distPath)

module.exports = {
  entry: path.resolve(srcPath, "main.js"),
  output: {
    path: distPath,
    filename: "scripts/bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      // this will apply to both plain `.js` files
      // AND `<script>` blocks in `.vue` files
      {
        test: /\.js$/,
        loader: "babel-loader",
      },
      // this will apply to both plain `.css` files
      // AND `<style>` blocks in `.vue` files
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
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
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
    ],
  },
  plugins: [
    new VueLoaderPlugin({
      title: "Title",
    }),
    // new cleanWebpackPlugin(),
    new htmlWebpackPlugin({
      template: path.resolve(publicPath, "index.html"),
    }),
    new CleanWebpackPlugin(),
  ],
}
