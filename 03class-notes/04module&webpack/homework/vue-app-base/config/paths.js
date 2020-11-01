const path = require("path")

const basePath = path.resolve("../")
const srcPath = path.resolve(basePath, "src")
const publicPath = path.resolve(basePath, "public")

module.exports = {
  basePath,
  srcPath,
  publicPath,
}
