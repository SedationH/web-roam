const { resolve } = require("path")

const basePath = resolve(__dirname, "../"),
  configPath = resolve(basePath, "config"),
  srcPath = resolve(basePath, "src"),
  publicPath = resolve(basePath, "public"),
  distPath = resolve(basePath,'dist')

module.exports = {
  basePath,
  configPath,
  srcPath,
  publicPath,
  distPath
}
