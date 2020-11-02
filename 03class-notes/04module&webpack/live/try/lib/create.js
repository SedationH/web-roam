const axios = require("axios")
const inquirer = require("inquirer")
module.exports = async function () {
  // 判断远程提供了什么列表

  const { data } = await axios.get(
    "https://api.github.com/users/sedationh/repos"
  )

  const repoList = data.map((item) => item.name)

  const prompList = [
    {
      type: "list",
      name: "repoName",
      message: "请选择模版",
      choices: repoList,
    },
  ]

  const ret = await inquirer.prompt(prompList)
  console.log(ret)
}
