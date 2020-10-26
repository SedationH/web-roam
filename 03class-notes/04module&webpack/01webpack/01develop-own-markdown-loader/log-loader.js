const { sources } = require("webpack")

module.exports = (sources) => {
  console.log(typeof sources)
  return `console.log('俺就是不处理')`
}
