const path = require("path")

module.exports = {
  mode: "none",
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
    path: path.join(__dirname, "dist"),
    publicPath: "dist/",
  },
  module: {
    rules: [
      {
        test: /.md$/,
        // use: ["./log-loader", "./markdown-loader"],
        use: "./markdown-loader",
      },
    ],
  },
}
