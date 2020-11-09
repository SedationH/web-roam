​	**知识这东西，一定要时常核实和订正，尤其是从别人那里学到的知识**

## 原理

第一件事情就是如何统一和管理我们所写的源代码

两个维度

- 代码格式角度
- 代码质量角度

> - **Formatting rules**: Rules that prevent inconsistent and ugly looking code (eg: max-len, no-mixed-spaces-and-tabs, keyword-spacing, comma-style…)
> - **Code-quality rules**: Rules that prevent useless or error making code (eg no-unused-vars, no-extra-bind, no-implicit-globals, prefer-promise-reject-errors…)



纵览要使用的工具🔧和其作用

- ESLint
- Prettier
- EditorConfig

重点摘要

> **Prettier** managed to reformat our code without us specifying any configuration to fix our max-len rule while **ESLint** could not. But Prettier did not warn us about the console.log statement which enters the `code quality` rules. So in order to have the best possible linting experience detecting both `code quality` and `code formatting`, one should definitely use both tools.

而EditorConfig，是使用更加广泛的代码规范**配置**工具，主要作用是提供个配置文件



[Why You Should Use ESLint, Prettier & EditorConfig](https://blog.theodo.com/2019/08/why-you-should-use-eslint-prettier-and-editorconfig-together/) 建议看原文



## 一些细节

### 可以在ESLint中集成 prettier通过 --fix来调用，如果两者配置冲突，如何解决？

> **Please keep in mind that the `.eslintrc.json` `extends` array's order is very important**. Basically each time a new configuration is added to the array, it will override the previous configurations. It is therefore of the utmost importance that `prettier` and `prettier/@typescript-eslint` are at the end of the array.
>
> With this configuration, no more problems appear. We can rest assured that ESLint will not try to do Prettier's job.

配置参考

```json
{
  "parser": "@typescript-eslint/parser",
  "extends": [
    "plugin:@typescript-eslint/recommended",
    "eslint:recommended",
    "prettier",
    "prettier/@typescript-eslint"
  ],
  "env": {
    "es6": true,
    "node": true
  },
  "rules": {
    "prettier/prettier": "error"
  },
  "plugins": ["prettier"]
}

```



## VSCode

VSCode是通过各种插件机制来变得强大，来看看VSCode formate的时候做了些什么

```zsh
["INFO" - 10:53:20 AM] Formatting /Users/sedationh/workspace/temp/editConfigTry/main.ts
["INFO" - 10:53:20 AM] Using ignore file (if present) at /Users/sedationh/workspace/temp/editConfigTry/.prettierignore
["INFO" - 10:53:20 AM] Loaded module 'prettier@2.1.2' from '/Users/sedationh/workspace/temp/editConfigTry/node_modules/prettier/index.js'
["INFO" - 10:53:20 AM] File Info:
{
  "ignored": false,
  "inferredParser": "typescript"
}
["INFO" - 10:53:20 AM] Detected local configuration (i.e. .prettierrc or .editorconfig), VS Code configuration will not be used
["INFO" - 10:53:20 AM] Using config file at '/Users/sedationh/workspace/temp/editConfigTry/.prettierrc'
["INFO" - 10:53:20 AM] Prettier Options:
{
  "filepath": "/Users/sedationh/workspace/temp/editConfigTry/main.ts",
  "parser": "typescript",
  "useTabs": false,
  "tabWidth": 4,
  "printWidth": 80
}
["INFO" - 10:53:20 AM] Formatting completed in 12.68964ms.
```

实践来看 .prettierrc &  .editorconfig 一样的配置同时存在的时候，优先使用前者

没有拿到本项目的 .prettierrc &  .editorconfig

```zsh
["INFO" - 3:44:10 PM] Formatting /Users/sedationh/workspace/web-roam/03class-notes/05vue/00vue-theory/01min-vue/vue.js
["INFO" - 3:44:10 PM] Using ignore file (if present) at /Users/sedationh/workspace/web-roam/.prettierignore
["INFO" - 3:44:10 PM] Using bundled version of prettier.
["INFO" - 3:44:10 PM] File Info:
{
  "ignored": false,
  "inferredParser": "babel"
}
["INFO" - 3:44:10 PM] No local configuration (i.e. .prettierrc or .editorconfig) detected, falling back to VS Code configuration
["INFO" - 3:44:10 PM] Prettier Options:
{
  "arrowParens": "always",
  "bracketSpacing": true,
  "endOfLine": "lf",
  "htmlWhitespaceSensitivity": "css",
  "insertPragma": false,
  "jsxBracketSameLine": false,
  "jsxSingleQuote": false,
  "printWidth": 60,
  "proseWrap": "preserve",
  "quoteProps": "as-needed",
  "requirePragma": false,
  "semi": false,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5",
  "useTabs": false,
  "vueIndentScriptAndStyle": false,
  "filepath": "/Users/sedationh/workspace/web-roam/03class-notes/05vue/00vue-theory/01min-vue/vue.js",
  "parser": "babel"
}
["INFO" - 3:44:10 PM] Formatting completed in 16.150872ms.
```



更多的还是自己试试吧 [代码参考](./editConfigTry)





