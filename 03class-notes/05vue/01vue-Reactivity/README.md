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



## 入口文件

看 `yarn dev` 执行了什么

`    "dev": "rollup -w -c scripts/config.js --sourcemap --environment TARGET:web-full-dev",`

[Command line flags about rollup](https://rollupjs.org/guide/en/#command-line-flags) 

查看config 文件

```js
 // Runtime+compiler development build (Browser)
  'web-full-dev': {
    entry: resolve('web/entry-runtime-with-compiler.js'), // !!!! 这里
    dest: resolve('dist/vue.js'),
    format: 'umd',
    env: 'development',
    alias: { he: './entity-decoder' },
    banner
  },
    
  web: resolve('src/platforms/web'), // -> 最终定位到这里

```



## 整体结构分析

大致分为平台相关和平台不相关的代码

- `src/platforms/web/entry-runtime-with-compiler.js`
  - web平台相关的入口
  - 重写了平台相关的$mount方法，增加处理template的能力
  - 增加静态方法compile
  - 引用了 `import Vue from './runtime/index'` 这个也是平台相关的
- `src/platforms/web/runtime/index.js`
  - web相关
  - 这里是$mount定义的地方
  - 平台相关的
    - uitils
    - directives & components
      - show model
      - Transition TransitionGroup
    - patch
- `src/core/index.js`
  - 平台不相关
  - initGlobalAPI(Vue) 设置Vue的一堆静态方法

- `src/core/instance/index.js` 终于找到了Vue的构造函数 这里是一切的出发点
  - 初始化实例方法

```js
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

initMixin(Vue)
stateMixin(Vue)
eventsMixin(Vue)
lifecycleMixin(Vue)
renderMixin(Vue)

export default Vue
```

