配置来配置去，真是让人头秃

Yarn & NPM 都是包管理工具，前者取长补短的基础上再开发 关于[不同](https://www.geeksforgeeks.org/difference-between-npm-and-yarn/)

Yarn 与 NPM是息息相关的

```zsh
$ yarn config get proxy --verbose
verbose 0.151654014 Checking for configuration file "/Users/sedationh/workspace/chrome-extensions-dev/t4/a/b/c/.npmrc".
verbose 0.152847207 Checking for configuration file "/Users/sedationh/.npmrc".
verbose 0.152971271 Found configuration file "/Users/sedationh/.npmrc".
verbose 0.15382097 Checking for configuration file "/usr/local/etc/npmrc".
verbose 0.154008668 Checking for configuration file "/Users/sedationh/workspace/chrome-extensions-dev/t4/a/b/c/.npmrc".
verbose 0.154153913 Checking for configuration file "/Users/sedationh/workspace/chrome-extensions-dev/t4/a/b/.npmrc".
verbose 0.154324738 Checking for configuration file "/Users/sedationh/workspace/chrome-extensions-dev/t4/a/.npmrc".
verbose 0.154473331 Checking for configuration file "/Users/sedationh/workspace/chrome-extensions-dev/t4/.npmrc".
verbose 0.154718645 Checking for configuration file "/Users/sedationh/workspace/chrome-extensions-dev/.npmrc".
verbose 0.15486009 Checking for configuration file "/Users/sedationh/workspace/.npmrc".
verbose 0.154958916 Checking for configuration file "/Users/sedationh/.npmrc".
verbose 0.155049119 Found configuration file "/Users/sedationh/.npmrc".
verbose 0.217650202 Checking for configuration file "/Users/.npmrc".
verbose 0.21950367 Checking for configuration file "/Users/sedationh/workspace/chrome-extensions-dev/t4/a/b/c/.yarnrc".
verbose 0.219695606 Checking for configuration file "/Users/sedationh/.yarnrc".
verbose 0.21982993 Found configuration file "/Users/sedationh/.yarnrc".
verbose 0.220099037 Checking for configuration file "/usr/local/etc/yarnrc".
verbose 0.220271709 Checking for configuration file "/Users/sedationh/workspace/chrome-extensions-dev/t4/a/b/c/.yarnrc".
verbose 0.220407406 Checking for configuration file "/Users/sedationh/workspace/chrome-extensions-dev/t4/a/b/.yarnrc".
verbose 0.220570927 Checking for configuration file "/Users/sedationh/workspace/chrome-extensions-dev/t4/a/.yarnrc".
verbose 0.22072574 Checking for configuration file "/Users/sedationh/workspace/chrome-extensions-dev/t4/.yarnrc".
verbose 0.220872796 Checking for configuration file "/Users/sedationh/workspace/chrome-extensions-dev/.yarnrc".
verbose 0.29916636 Checking for configuration file "/Users/sedationh/workspace/.yarnrc".
verbose 0.299347628 Checking for configuration file "/Users/sedationh/.yarnrc".
verbose 0.299486855 Found configuration file "/Users/sedationh/.yarnrc".
verbose 0.299814236 Checking for configuration file "/Users/.yarnrc".
verbose 0.302143905 current time: 2020-11-04T14:28:04.658Z
http://127.0.0.1:7890/
```

可见优先查询的还是`.npmrc`文件

可以看出查询规律

整体上 先查询`.npmrc` 再查询 `.yarnrc`

单对一种类型如`.yarnrc`文件来说

```zsh
verbose 0.21950367 Checking for configuration file "/Users/sedationh/workspace/chrome-extensions-dev/t4/a/b/c/.yarnrc". 
verbose 0.219695606 Checking for configuration file "/Users/sedationh/.yarnrc". 
verbose 0.21982993 Found configuration file "/Users/sedationh/.yarnrc".
verbose 0.220099037 Checking for configuration file "/usr/local/etc/yarnrc".
verbose 0.220271709 Checking for configuration file "/Users/sedationh/workspace/chrome-extensions-dev/t4/a/b/c/.yarnrc".
verbose 0.220407406 Checking for configuration file "/Users/sedationh/workspace/chrome-extensions-dev/t4/a/b/.yarnrc".
verbose 0.220570927 Checking for configuration file "/Users/sedationh/workspace/chrome-extensions-dev/t4/a/.yarnrc".
verbose 0.22072574 Checking for configuration file "/Users/sedationh/workspace/chrome-extensions-dev/t4/.yarnrc".
verbose 0.220872796 Checking for configuration file "/Users/sedationh/workspace/chrome-extensions-dev/.yarnrc".
verbose 0.29916636 Checking for configuration file "/Users/sedationh/workspace/.yarnrc".
verbose 0.299347628 Checking for configuration file "/Users/sedationh/.yarnrc".
verbose 0.299486855 Found configuration file "/Users/sedationh/.yarnrc".
verbose 0.299814236 Checking for configuration file "/Users/.yarnrc".
```

1. 先pwd()/.yarnrc  Tip: pwd是当前命令执行的位置

2. ~/.yarnrc 用户的
3. /usr/local/etc/yarnrc 全局配置中的
4. 从当前目录逐级向上一次找.yarnrc

在当前目录下新建

.npmrc

```js
qq="1"
```

.yarnrc

```js
qq 2
wc 123
```

```zsh
$ yarn config get qq
1
$ yarn config get wc
123
$ npm config get qq
1
```

./t/.npmrc

```js
qq="3"
```

```zsh
$ yarn config get qq
3
```

可见yarn没有找到的才会去用.npmrc中提供的

**(这样黑盒测试感觉挺呆的，应该看看yarn代码上是怎么实现的)**



个人常用的也就proxy & registry

使用 yrm 进行 registry的管理

```zsh
$ yrm --help
Usage: yrm [options] [command]

Options:
  -V, --version                output the version number
  -h, --help                   output usage information

Commands:
  ls                           List all the registries
  current                      Show current registry name
  use <registry>               Change registry to registry
  add <registry> <url> [home]  Add one custom registry
  del <registry>               Delete one custom registry
  home <registry> [browser]    Open the homepage of registry with optional browser
  test [registry]              Show response time for specific or all registries
  help                         Print this help
```

