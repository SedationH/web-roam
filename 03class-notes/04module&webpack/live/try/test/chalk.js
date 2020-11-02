const chalk = require("chalk")

const colors = ["yellow", "blue", "red", "gray"]

for (const color of colors) {
  console.log(eval(`chalk.${color}('SedationH')`))
}

// 添加背景色
console.log(chalk.bgYellowBright(chalk.blue("Hi")))

console.log(chalk`
  {green.bold 爱你就像爱生命❤️}
  {blue 这需要勇气}
  {red 也需要热爱}
`)
