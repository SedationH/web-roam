从源码角度看响应式



提一点下载技巧

```zsh
git clone --depth 1 https://github.com.cnpmjs.org/vuejs/vue.git
```



## debug

```json
    "dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-full-dev",
```

开启sourcemap 方便调试，注意静态服务启动的位置在根目录

`    <script src="../../dist/vue.js"></script>` 类似这样的语句才能找到相应的位置，这样就可以愉快的debug了



## build文件解释

[dist](./vue/dist) 中有响应的解释

重点注意的内容

### full = runtime-only + compiler

compiler负责的是将template -> 通过h 处理成为结构化的对象(vdom),再通过vue进行render

具体代码上来看使用差异

```js
// full
new Vue({
  el: '#app',
  template: '<h1>{{msg}}</h1>',
  data: {
    msg: 'Hello Vue'
  }
})

// runtime-only
new Vue({
  el: '#app',
  render(h) {
    return h('hi',this.msg)
  },
  data: {
    msg: 'Hello Vue'
  }
})
```

日常使用大都是runtime-only，通过别的🔧先进行pre-compile

使用vue-cli 创建的项目默认使用的vue也是runtime-only

越小越快嘛



.vue文件会被webpack进行预处理



### 打包生成的格式

|                               | UMD                | CommonJS              | ES Module          |
| ----------------------------- | ------------------ | --------------------- | ------------------ |
| **Full**                      | vue.js             | vue.common.js         | vue.esm.js         |
| **Runtime-only**              | vue.runtime.js     | vue.runtime.common.js | vue.runtime.esm.js |
| **Full (production)**         | vue.min.js         |                       |                    |
| **Runtime-only (production)** | vue.runtime.min.js |                       |                    |

-  [UMD](https://github.com/umdjs/umd) builds can be used directly in the browser via a `<script>` tag. The default file from Unpkg CDN at [https://unpkg.com/vue](https://unpkg.com/vue) is the Runtime + Compiler UMD build (`vue.js`).



在vue-cli的项目下可以`vue inspect > out.js` 看vue的webpack配置

其中

```js
module.exports = {
  // ...
  resolve: {
    alias: {
      // $ 表示精确匹配
      'vue$': 'vue/dist/vue.runtime.esm.js' // 'vue/dist/vue.common.js' for webpack 1
    }
  }
}
```

