## 类型系统

### 强类型 弱类型（类型安全）

强类型不允许随意的隐式类型转换,而弱类型是允许的

py是一个强类型的，尽管一个变量的类型可以改变,这个改变体现的是py语言的动态类型特征

### 静态类型 动态类型（类型检查）

- 静态类型：
  - 一个变量声明的时候类型是明确的
  - 声明后，类型不许再被修改
- 动态类型：
  - 运行阶段才能确定一个变量的类型
  - 变量的类型可以随时变化
  - 也可以说，变量是没有类型的，变量中的值是有类型的



JS也作为脚本语言，没有编译阶段，也就没法做类型检查

JS是弱类型 动态类型的语言



## 动态类型造成的问题

```js
const obj = {}
obj.foo() // 运行的时候才能发现问题

sum(100,'100')

obj[true] = 1
obj['true'] === 1
```

当代码少的时候，可以约定解决。

- 提前暴露错误
- 智能提示
- 重构更可靠(破环性改造)



## 工具 [flow](https://flow.org/en/)

查文档，自己看，主要看别人代码可能需要

类型检查工具flow

工作逻辑

执行flow可以进行编译检查出现的类型错误

通过vscode相关插件可以再编写代码的时候，编辑器显示错误

[Usage](https://flow.org/en/docs/usage/)

[Tools](https://flow.org/en/docs/tools/)

[Flow Type Cheat Sheet](https://www.saltycrane.com/cheat-sheets/flow-type/latest/)



## Start [TS](https://www.typescriptlang.org/)

TS可以做什么？

- 为JS增添类型检查
- 实现向前版本的转换

```zsh
yarn add typescript --dev 

# 进行编译
yarn tsc xx.js
```

可以编译整个项目 ｜ 单个文件

前者写个`.tsconfig`进行配置

```zsh
yarn tsc --init
```



**标准库机制**

标准库就是内置对象所对应的声明



默认调用traget所指向ES版本的标准库，可能存在的问题

Promise Symbol等无法使用，因为在lib中无相关定义

Vscode通过调用TS serve来进行智能提示和检查,

如果在`.tsconfig`中不提供相应的语法相对应的lib，编辑器会报错



解决方案 ： 更改taget | 添加lib

后者值得注意的是 添加了EMACScript2015，其中无dom lib，即一些如console.log的web运行时提供给的api无法使用(Tip: Dom & BOM在TS lib 规范中都归于DOM，不作区分)

[特性参考](https://juejin.im/post/6844903811622912014#heading-0)



但因为node版本的不同，可能在执行新的语法的时候不支持如`Object.entries()`

使用core-js把能够polifill的全部polyfill

使用

```zsh
$ node -v
v4.9.1

$ node ../dist/02poly-ts.js
/Users/sedationh/workspace/web-roam/03class-notes/02ES&ts/dist/02poly-ts.js:9
var entries = Object.entries(tony);
                     ^

TypeError: Object.entries is not a function
    at Object.<anonymous> (/Users/sedationh/workspace/web-roam/03class-notes/02ES&ts/dist/02poly-ts.js:9:22)
    at Module._compile (module.js:409:26)
    at Object.Module._extensions..js (module.js:416:10)
    at Module.load (module.js:343:32)
    at Function.Module._load (module.js:300:12)
    at Function.Module.runMain (module.js:441:10)
    at startup (node.js:140:18)
    at node.js:1043:3
```

解决方案

`import "core-js/features/object"`



方案二

使用tsc traget的时候 target 定为 'esnext就好' 只用于从ts -> js的转换

使用babel做兼容性处理



**作用域问题**

如果当前文件没有作为module导出，那么ts认为都是挂在全局上，可能会出现命名冲突的问题



解决方案：

文件底部添加 `export {}`让ts判断这个为 module  模块有单独作用域



## More

[Read doc & handbook](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

