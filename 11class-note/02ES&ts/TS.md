## 类型系统

### 强类型 弱类型（类型安全）

强类型不允许随意的隐式类型转换,而弱类型是允许的

py是一个强类型的，尽管一个变量的类型可以改变

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



## 弱类型造成的问题

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





