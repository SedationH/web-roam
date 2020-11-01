const path = require("path")

const basePath = path.resolve(__dirname,'../')
const srcPath = path.resolve(basePath, "src")
const publicPath = path.resolve(basePath, "public")
const distPath = path.resolve(basePath, "dist")

console.log(basePath,__dirname)

module.exports = {
  basePath,
  srcPath,
  publicPath,
  distPath,
}
