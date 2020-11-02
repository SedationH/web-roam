#! node
const mainFn = require("..")
const { program } = require("commander")

const actionMap = {
  create: {
    alias: "crt",
    des: "create a project",
    examples: ["try crt <projectName>"],
  },
  config: {
    alias: "cfg",
    des: "conifg a project",
    examples: [
      "try cfg set <key> <value>",
      "try cfg get <key>",
    ],
  },
}

Reflect.ownKeys(actionMap).forEach((name) => {
  const { alias, des } = actionMap[name]
  program
    .command(name)
    .alias(alias)
    .description(des)
    .action(() => {
      // 都发给index统一处理
      mainFn(name, process.argv.slice(3))
    })
})

// try --help 事件订阅
program.on("--help", () => {
  console.log("Examples: ")
  Reflect.ownKeys(actionMap).forEach((name) => {
    actionMap[name].examples.forEach((item) => {
      console.log("  " + item)
    })
  })
})

program.parse(process.argv)
