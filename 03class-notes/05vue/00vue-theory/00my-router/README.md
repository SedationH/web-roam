# vue-router

 Vue.use(VueRouter) + router + 视图 + 挂载



**核心使用逻辑**

```json
// router/index.js
// 注册插件
Vue.use(VueRouter)
const router = new VueRouter({
  routes: [
    {
      name: 'index',
      path: '/',
      component: Index
    }
  ]
})

new Vue({
  router,
  render: h => h(App)
}).mount('#app')
```



new Vue上在使用了router后 挂上了

- route 路由规则
- router 路由



关于编程式导航

```js
this.$router.replace('/login')
```



histroy | Hash 模式的区别

- Hash 基于锚点 onhashchange事件	
- History 基于 HTML5 Histry API
  - history.pushState()
  - history.replaceState()



History模式的使用

- 需要服务器支持
- 直接访问www.demo.cn/login还是找不到页面的
- 在服务端应该除了静态资源都返回单页应用的index.html,否则访问会报Cannot GET /login



支持history的Nodejs Express 配置

```js
const path = require('path')
// 导入处理 history 模式的模块
const history = require('connect-history-api-fallback')
// 导入 express
const express = require('express')

const app = express()
// 注册处理 history 模式的中间件
app.use(history())
// 处理静态资源的中间件，网站根目录 ../web
app.use(express.static(path.join(__dirname, '../web')))

// 开启服务器，端口是 3000
app.listen(3000, () => {
  console.log('服务器开启，端口：3000')
})
```



nginx

```nginx
server {
  
  location / {
    root html;
    index index.html;
    # 根据路径寻找资源，如果是静态资源文件 直接返回 不是的话 找uri/index.html 都不行的话 使用/index.html
    try_files $uri $uri/ /index.html;
  }
}
```



写个自己的vue-router 注意整清楚

- Vue.use() 提供了什么？

- 运行的上下文是什么



值得注意的是 [runtimeCompiler](https://cli.vuejs.org/config/#runtimecompiler) 

> ### runtimeCompiler
>
> - Type: `boolean`
>
> - Default: `false`
>
>   Whether to use the build of Vue core that includes the runtime compiler. Setting it to `true` will allow you to use the `template` option in Vue components, but will incur around an extra 10kb payload for your app.
>
>   See also: [Runtime + Compiler vs. Runtime only](https://vuejs.org/v2/guide/installation.html#Runtime-Compiler-vs-Runtime-only).

默认使用是 runtime only  不能直接使用template 



> vue.runtime.esm.js?2b0e:619 [Vue warn]: You are using the runtime-only build of Vue where the template compiler is not available. **Either pre-compile the templates into render functions, or use the compiler-included build.**
>
> found in
>
> ---> <RouterLink>
>        <App> at src/App.vue
>          <Root>





完整= runtime + compiler 程序运行的时候complier会把template 转 render 函数



render函数中的h函数是转virtual dom的