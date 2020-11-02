初始化cli.js文件的执行

```zsh
$ npm link
/Users/sedationh/.nvm/versions/node/v14.0.0/bin/try -> /Users/sedationh/.nvm/versions/node/v14.0.0/lib/node_modules/try/bin/cli.js
/Users/sedationh/.nvm/versions/node/v14.0.0/lib/node_modules/try -> /Users/sedationh/workspace/web-roam/03class-notes/04module&webpack/live/try

$ which try
/Users/sedationh/.nvm/versions/node/v14.0.0/bin/try

# cli.js
console.log(process.argv)

$ try create 1
[
  '/Users/sedationh/.nvm/versions/node/v14.0.0/bin/node',
  '/Users/sedationh/.nvm/versions/node/v14.0.0/bin/try',
  'create',
  '1'
]

```

use commander 来简化操作流程，大致API

```js
program
  .command("create")
  .alias("crt")
  .description("create a project")
  .action(() => {
    console.log("ctr dirction exe")
  })
```



cli.js 中

```js
const main = require('..')

// 上一个文件中没有默认的 index.js -> packages.json -> main: './lib/index.js'
// 是这样的寻找路径
```



整体思路

- bin/cli.js 来负责与用户的命令交互
- lib/index.js 来负责处理逻辑的分发
- lib/create.js 来负责具体的逻辑指令



create.js

下载模版 根据选择 渲染模版中的数据

download-git-repo 下载模版

ora 等待效果

inquirer 命令行交互

变色变帅 chalk

不知道仓库有什么模版 -> axios