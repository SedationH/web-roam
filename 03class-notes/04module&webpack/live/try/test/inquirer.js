const inquirer = require("inquirer")
const chalk = require("chalk")

const prompList = [
  {
    type: "input",
    name: "user",
    message: "请输入用户名",
    validate(val) {
      if (!val)
        return chalk.bgCyan(chalk.red(`必须输入一个用户名`))
      return true
    },
  },
  {
    type: "confirm",
    name: "isLoad",
    message: "是否选择依赖",
  },
  {
    type: "list",
    name: "method",
    choices: ["npm", "yarn"],
    when({ isLoad }) {
      if (isLoad) {
        return true
      } else {
        return false
      }
    },
  },
  {
    type: "checkbox",
    name: "hobby",
    message: "选额爱好",
    pageSize: 3,
    choices: ["game", "video", "music", "guita"],
  },
]

inquirer.prompt(prompList).then((ans) => {
  console.log(ans)
})
