## vite原理

基于浏览器原生的ES Module特性

> ```html
> <script type="module" src="/src/main.js"></script>
> ```
>
> 会进行服务器请求 `protocal://host:port/src/main.js`
>
> ```js
> import { createApp } from 'vue'
> ```
>
> 这个也是，会发出新的请求向server请求 `protocal://host:port/vue` 文件

vite在client 向 server 请求的过程中，进行拦截和处理



### 对比webpack

- vue-cli-service / webpack
  - 像 webpack 这类工具的做法是将所有的模块提前编译，打包进 bundle 里。
  - 也就是，不管模块是否被执行、使用，都要被编译打包到 bundle 里。
  - 随着项目越来越大，打包后的 bundle 也越来越大，打包的速度自然越来越慢。
- Vite
  - Vite 利用现代浏览器原生支持的 ES Module 模块化的特性，省略了对模块的打包。
  - 对于需要编译的文件，比如单文件组件、样式模块等，Vite 采用另一种模式 - 即时编译。
  - 即具体请求某个文件的时候，才会在服务端编译这个文件。
  - 这种即时编译的好处，主要体现在按需编译，速度会更快。



### 究竟有没有必要打包应用？

以前，使用 Webpack 打包会把所有的模块打包到 bundle 里，这样打包的原因主要有两个：

- 浏览器环境并不支持模块化
  - 随着现代浏览器对 ES 标准支持的逐渐完善，这个问题已经慢慢不存在了。
  - 现阶段绝大多数浏览器都支持 ES Module 特性。
- 零散的模块文件会产生大量的 HTTP 请求
  - HTTP 2 多路复用的特性，减少了网络请求次数。



## 完成静态Server

```js
#!/usr/bin/env node

const Koa = require('koa')
const send = require('koa-send')

const app = new Koa()

// 1. 静态文件服务
app.use(async (ctx, next) => {
  await send(ctx, ctx.path, {
    root: process.cwd(),
    index: 'index.html',
  })
  await next()
})

app.listen(3000)

console.log('http://localhost:3000')
	
```

![image-20210118102348750](http://picbed.sedationh.cn/image-20210118102348750.png)



## 正则替换

![image-20210118174920630](http://picbed.sedationh.cn/image-20210118174920630.png)

```js
.replace(/(from\s+['"])(?![\.\/])/g, '$1/@modules/')
```

```js
var result = "hello".replace(/(?!l)/g, '#'); console.log(result);
// => "#h#ell#o#"
```

这个replace 相当于往指定位置上加内容 `vue` 和 `'` 之间的

![image-20210118175517681](http://picbed.sedationh.cn/image-20210118175517681.png)



## 加载第三方模块

```js
const pkg = require(pkgPath)
ctx.path = path.join(
  '/node_modules',
  moduleName,
  pkg.module
)
```

解释下这里

vue package.json

```js
{
  "name": "vue",
  "version": "3.0.5",
  "description": "vue",
  "main": "index.js",
  "module": "dist/vue.runtime.esm-bundler.js",
  "types": "dist/vue.d.ts",
  "unpkg": "dist/vue.global.js",
  "jsdelivr": "dist/vue.global.js",
  "files": [
    "index.js",
    "dist"
  ],
```



```js
ctx.body = contents
  .replace(/(from\s+['"])(?![\.\/])/g, '$1/@modules/')
  .replace(/process\.env\.NODE_ENV/g, '"development"')
```

注意还要把process.env.NODE_ENV替换一下，现在不用webpack进行处理了。也没有对js进行提前处理



## vue sfc (single-file component) 处理

先看下 vite 是如何处理的

![image-20210118181502618](http://picbed.sedationh.cn/image-20210118181502618.png)

注意到vite拦截了对$.vue的请求，并对原来的单文件进行了处理

```js
import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/App.vue");import HelloWorld from '/src/components/HelloWorld.vue'

const _sfc_main = {
  expose: [],
  setup(__props) {


return { HelloWorld }
}

}
import { createVNode as _createVNode, Fragment as _Fragment, openBlock as _openBlock, createBlock as _createBlock } from "/node_modules/.vite/vue.71d55805.js"

const _hoisted_1 = /*#__PURE__*/_createVNode("img", {
  alt: "Vue logo",
  src: "/src/assets/logo.png"
}, null, -1 /* HOISTED */)

function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return (_openBlock(), _createBlock(_Fragment, null, [
    _hoisted_1,
    _createVNode($setup["HelloWorld"], { msg: "Hello Vue 3 + Vite" })
  ], 64 /* STABLE_FRAGMENT */))
}

import "/src/App.vue?vue&type=style&index=0&lang.css"

_sfc_main.render = _sfc_render
_sfc_main.__file = "/Users/sedationh/workspace/web-roam/03class-notes/05vue/04vue3/01vite-simulation/vite-project/src/App.vue"
export default _sfc_main
_sfc_main.__hmrId = "7ba5bd90"
__VUE_HMR_RUNTIME__.createRecord(_sfc_main.__hmrId, _sfc_main)
import.meta.hot.accept(({ default: updated, _rerender_only }) => {
  if (_rerender_only) {
    __VUE_HMR_RUNTIME__.rerender(updated.__hmrId, updated.render)
  } else {
    __VUE_HMR_RUNTIME__.reload(updated.__hmrId, updated)
  }
})
//# sourceMappingURL=data:application/jso....
```

相当于对App.vue进行了两次请求

./App.vue & "/src/App.vue?vue&type=style&index=0&lang.css"

第二次

```js
import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/App.vue?vue&type=style&index=0&lang.css");import { updateStyle, removeStyle } from "/@vite/client"
const id = "/Users/sedationh/workspace/web-roam/03class-notes/05vue/04vue3/01vite-simulation/vite-project/src/App.vue?vue&type=style&index=0&lang.css"
const css = "\n#app {\n  font-family: Avenir, Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  text-align: center;\n  color: #2c3e50;\n  margin-top: 60px;\n}\n"
updateStyle(id, css)
import.meta.hot.accept()
export default css
import.meta.hot.prune(() => removeStyle(id))
```



使用 @vue/compiler-sfc 来处理

3.0.0-rc.10 版本的时候还是全部转化为 js 

> This package contains lower level utilities that you can use if you are writing a plugin / transform for a bundler or module system that compiles Vue single file components into JavaScript. It is used in [vue-loader](https://github.com/vuejs/vue-loader).
>
> The API surface is intentionally minimal - the goal is to reuse as much as possible while being as flexible as possible.

后面改成

```
                                  +--------------------+
                                  |                    |
                                  |  script transform  |
                           +----->+                    |
                           |      +--------------------+
                           |
+--------------------+     |      +--------------------+
|                    |     |      |                    |
|  facade transform  +----------->+ template transform |
|                    |     |      |                    |
+--------------------+     |      +--------------------+
                           |
                           |      +--------------------+
                           +----->+                    |
                                  |  style transform   |
                                  |                    |
                                  +--------------------+
```

说实在这里的有些不大明白 凑合用了



目前还没处理好component

