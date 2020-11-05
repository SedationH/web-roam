# vue-app-base

1. 这是一个使用 Vue CLI 创建出来的 Vue 项目基础结构
2. 有所不同的是这里我移除掉了 vue-cli-service（包含 webpack 等工具的黑盒工具）
3. 这里的要求就是直接使用 webpack 以及你所了解的周边工具、Loader、Plugin 还原这个项目的打包任务
4. 尽可能的使用上所有你了解到的功能和特性



## 记录一些关于vue配置的特别点

[Vue loader](https://vue-loader.vuejs.org/guide/#vue-cli) 

```js
// webpack.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // this will apply to both plain `.js` files
      // AND `<script>` blocks in `.vue` files
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      // this will apply to both plain `.css` files
      // AND `<style>` blocks in `.vue` files
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    // make sure to include the plugin for the magic
    new VueLoaderPlugin()
  ]
}
```



esModule 起到什么作用？好多配置加了这个就可以正常走了，应该是CJS EMS的兼容问题

> By default, `file-loader` generates JS modules that use the ES modules syntax. There are some cases in which using ES modules is beneficial, like in the case of [module concatenation](https://webpack.js.org/plugins/module-concatenation-plugin/) and [tree shaking](https://webpack.js.org/guides/tree-shaking/).
>
> You can enable a CommonJS module syntax using:





config 思路很简单 所有的配置文件都放到config文件下

```zsh
config
├── paths.js # 集中提供所有的路径
├── webpack.common.js # 公共
├── webpack.dev.js # dev模式
└── webpack.prod.js # build打包
```

```js
"scripts": {
  "dev": "webpack-dev-server --config ./config/webpack.dev.js",
  "build": "webpack --config ./config/webpack.prod.js",
  "serve": "browser-sync dist --f dist --open --port 4000",
  "lint": "echo \"请使用 ESLint 实现此任务\""
},
```

具体看文件配置吧