const HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  devtool: "eval-cheap-module-source-map",
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
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),
  ],
}
