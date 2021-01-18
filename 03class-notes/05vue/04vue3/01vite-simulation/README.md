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

