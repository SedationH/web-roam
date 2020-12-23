## [Vue SSR](https://ssr.vuejs.org/#what-is-server-side-rendering-ssr)

nuxt已经封装了这个的使用

简单说下设计逻辑，首屏渲染通过服务器的node环境，之后页面的交互被客户端的js接管(客户端激活)。

> Vue.js is a framework for building client-side applications. By default, Vue components produce and manipulate DOM in the browser as output. However, it is also possible to render the same components into HTML strings on the server, send them directly to the browser, and finally "hydrate" the static markup into a fully interactive app on the client.
>
> A server-rendered Vue.js app can also be considered "isomorphic" or "universal", in the sense that the majority of your app's code runs on both the server **and** the client.



接下来就是跟着文档走了



尝试自己搞个ssr开发环境，主要提一下开发配置

| webpack                                                      | webpack 核心包                         |
| ------------------------------------------------------------ | -------------------------------------- |
| webpack-cli                                                  | webpack 的命令行工具                   |
| webpack-merge                                                | webpack 配置信息合并工具               |
| webpack-node-externals                                       | 排除 webpack 中的 Node 模块            |
| rimraf                                                       | 基于 Node 封装的一个跨平台 rm -rf 工具 |
| friendly-errors-webpack-plugin                               | 友好的 webpack 错误提示                |
| @babel/core   @babel/plugin-transform-runtime   @babel/preset-env   babel-loader | Babel 相关工具                         |
| vue-loader   vue-template-compiler                           | 处理 .vue 资源                         |
| file-loader                                                  | 处理字体资源                           |
| css-loader                                                   | 处理 CSS 资源                          |
| url-loader                                                   | 处理图片资源                           |

