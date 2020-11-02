const path = require("path")
module.exports = (name, ...args) => {
  // 分发处理处理
  require(`./${name}`)()
}
