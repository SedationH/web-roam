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



有些文件里在引用其他模块的时候，有默认src为根的效果

比如这个文件 vue/src/platforms/web/runtime/index.js

```js
import config from 'core/config'  -> src/core/config
```

这个效果是通过rollup来实现的，具体代码

```js
const aliases = require("./alias");

... 

function genConfig(name) {
  const opts = builds[name];
  const config = {
    input: opts.entry,
    external: opts.external,
    plugins: [flow(), alias(Object.assign({}, aliases, opts.alias))].concat(
      opts.plugins || []
    ),
...

if (process.env.TARGET) {
  module.exports = genConfig(process.env.TARGET);
} else {
  exports.getBuild = genConfig;
  exports.getAllBuilds = () => Object.keys(builds).map(genConfig);
}
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
    - config
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

// 这
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

## 关于导入的研究

 参考 [import-vue](./import-vue)

```zsh
$ tree    
.
├── index.html
├── index.js
└── lib
    ├── other
    └── vue
        ├── core
        │   ├── index.js log(2)
        │   └── instance
        │       └── index.js log(1)
        └── platforms
            ├── web
            │   ├── entry-runtime-with-compiler.js log(4)
            │   └── runtime
            │       └── index.js log(3)
            └── weex
```

总结一下  是如何处理import & export这样的模块化机制的 和 于CJS的比较

[阅读🔗](https://wizardforcel.gitbooks.io/es6-tutorial-3e/content/docs/module-loader.html)

- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。



import 有提升 有顺序  只执行一次  递归执行 

https://es6.ruanyifeng.com/#docs/module 理解这里所提的接口 想想Dan所提过的wires

但在pacel中，等价转成了es5，这里也涉及到webpack是如何处理这样的依赖关系的，还是相互依赖的问题，下次在研究



## 从入口开始

这里，通过源码可以看出一个问题

在**Full**下，如果同时具有template & render 方法 会执行哪一个呢？

```js
// 可见有render就不需要处理template了
if(!options.render){
  ....
}
```

还发现不能在body 或者 html标签下挂载	

```js
/* istanbul ignore if */
if (el === document.body || el === document.documentElement) {
  process.env.NODE_ENV !== 'production' && warn(
    `Do not mount Vue to <html> or <body> - mount to normal elements instead.`
  )
  return this
}
```



## 看静态成员

```js
import Vue from './instance/index'
import { initGlobalAPI } from './global-api/index'
import { isServerRendering } from 'core/util/env'
import { FunctionalRenderContext } from 'core/vdom/create-functional-component'

initGlobalAPI(Vue) -> 关键在这里 要挂一堆静态方法

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
})

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
})

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
})

Vue.version = '__VERSION__'

export default Vue

```



```js
/* @flow */

import config from "../config"
import { initUse } from "./use"
import { initMixin } from "./mixin"
import { initExtend } from "./extend"
import { initAssetRegisters } from "./assets"
import { set, del } from "../observer/index"
import { ASSET_TYPES } from "shared/constants"
import builtInComponents from "../components/index"
import { observe } from "core/observer/index"

import {
  warn,
  extend,
  nextTick,
  mergeOptions,
  defineReactive,
} from "../util/index"

export function initGlobalAPI(Vue: GlobalAPI) {
  // config
  const configDef = {}
  configDef.get = () => config
  if (process.env.NODE_ENV !== "production") {
    configDef.set = () => {
      warn(
        "Do not replace the Vue.config object, set individual fields instead."
      )
    }
  }

  Object.defineProperty(Vue, "config", configDef)
  // 使用场景
  // // install platform specific utils
  // Vue.config.mustUseProp = mustUseProp
  // Vue.config.isReservedTag = isReservedTag
  // Vue.config.isReservedAttr = isReservedAttr
  // Vue.config.getTagNamespace = getTagNamespace
  // Vue.config.isUnknownElement = isUnknownElement

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn,
    extend,
    mergeOptions,
    defineReactive,
  }

  Vue.set = set
  Vue.delete = del
  Vue.nextTick = nextTick

  // 初始化Vue.options对象，并拓展
  // components/disrectives/filters属性
  Vue.options = Object.create(null)
  ASSET_TYPES.forEach(type => {
    Vue.options[type + "s"] = Object.create(null)
  })

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue

  // 浅拷贝 注册全局组建
  // export function extend (to: Object, _from: ?Object): Object {
  //   for (const key in _from) {
  //     to[key] = _from[key]
  //   }
  //   return to
  // }
  // 设置 keep-alive组件
  extend(Vue.options.components, builtInComponents)

  // 注册Vue.use 来注册插件
  initUse(Vue)
  // 注册Vue.mixin来实现对Vue.options的混入
  initMixin(Vue)
  // Vue.extend 通过 传入options返回继承于根Vue的构造函数
  initExtend(Vue)
  // 因为Vue.directive filter component参数的相似 这里统一处理
  initAssetRegisters(Vue)

  // 2.6 explicit observable API
  Vue.observable = <T>(obj: T): T => {
    observe(obj)
    return obj
  }
}
```



## 看实例成员

```js
import { initMixin } from './init'
import { stateMixin } from './state'
import { renderMixin } from './render'
import { eventsMixin } from './events'
import { lifecycleMixin } from './lifecycle'
import { warn } from '../util/index'

// 这里使用构造函数而不是class来实现，是为了保持下面
// 函数在向Vue.prototype上挂载方法时候的一致性
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  this._init(options)
}

// 都是在Vue.protortype上挂方法 使用的就是vue的实例

// _init 上面构造函数就在使用 用于初始化vm实例
initMixin(Vue)
// vm $data $props $set $delete $watch
stateMixin(Vue)
// $on $once $off $emit
eventsMixin(Vue)
// _uodate $forceUpdate $destroy
lifecycleMixin(Vue)
// $nextTick _render
renderMixin(Vue)

export default Vue

```



## _init

完成静态和实例方法的初始化，vm._init调用进行初始化

```js

let uid = 0

export function initMixin (Vue: Class<Component>) {
  Vue.prototype._init = function (options?: Object) {
    // 传入的用户设置的options
    // 函数this指向vm
    const vm: Component = this
    // a uid`
    vm._uid = uid++

    let startTag, endTag
    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      startTag = `vue-perf-start:${vm._uid}`
      endTag = `vue-perf-end:${vm._uid}`
      mark(startTag)
    }

    // a flag to avoid this being observed
    // 如果是Vue实例不需要被observe
    vm._isVue = true
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options)
    } else {
      vm.$options = mergeOptions(
        // 在初始化静态成员的时候，已经在vm.constructor上挂了很多方法 指令和全局组件
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    /* istanbul ignore else */
    if (process.env.NODE_ENV !== 'production') {
      // vm._renderProxy = new Proxy(vm, handlers)
      initProxy(vm)
    } else {
      vm._renderProxy = vm
    }
    // expose real self
    vm._self = vm


    initLifecycle(vm)
    // 父亲的事件也拿过来attach
    initEvents(vm)
    // render(h) -> h: createElement
    // $attrs $listeners
    initRender(vm)
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    // handle data props method
    initState(vm)
    initProvide(vm) // resolve provide after data/props
    callHook(vm, 'created')

    /* istanbul ignore if */
    if (process.env.NODE_ENV !== 'production' && config.performance && mark) {
      vm._name = formatComponentName(vm, false)
      mark(endTag)
      measure(`vue ${vm._name} init`, startTag, endTag)
    }

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
```



## debug   Vue初始化过程 & 首次渲染过程

技巧 在四个Vue导出文件中进行端点 Watch Vue 查看相关属性变化

![image-20201129142622633](http://picbed.sedationh.cn/image-20201129142622633.png)



![image-20201129155455644](http://picbed.sedationh.cn/image-20201129155455644.png)

### 重要函数 mountComponent

先看调用方式

```js
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}
```



函数位于 src/core/instance/lifecycle.js

定义了 updateComponent

```js
 updateComponent = () => {
   vm._update(vm._render(), hydrating)
 }
```

最终使用是在

```js
new Watcher(vm, updateComponent, noop, {
  before () {
    if (vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'beforeUpdate')
    }
  }
}, true /* isRenderWatcher */)
```

中 

注 意  调用方式

```js
this.getter = expOrFn

this.value = this.lazy

	? undefined

	: this.get()
```

![image-20201129155027666](http://picbed.sedationh.cn/image-20201129155027666.png)

注意调用栈



## Vue的响应式处理

前提概念 

Watcher & Dep

```js
// 发布者-目标-dependency
class Dep {
  constructor() {
    // 记录所有的订阅者
    this.subs = []
  }
  // 添加订阅者
  addSub(sub) {
    if (sub && sub.update) {
      this.subs.push(sub)
    }
  }
  // 发布通知
  notify() {
    this.subs.forEach((sub) => {
      sub.update()
    })
  }
}
// 订阅者-观察者 收到通知后 进行更新
class Watcher {
  // 观察者内部有实现update的方法，供发布者调用
  update() {
    console.log("update")
  }
}

// 测试
let dep = new Dep()
let watcher = new Watcher()

dep.addSub(watcher)
dep.notify()
```

从视图和数据的角度来看，视图是Watcher 实现 update方法，数据收集来自视图的订阅，当数据更新的时候，notify所有的Watcher进行视图更新



src/core/instance/lifecycle.js 中的mountComponent 创建了Watcher

```js
new Watcher(vm, updateComponent, noop, {
  before () {
    if (vm._isMounted && !vm._isDestroyed) {
      callHook(vm, 'beforeUpdate')
    }
  }
}, true /* isRenderWatcher */)
```

在Watcher调用get方法 pushTarget(this)  存储了当前Watcher 实例

```js
// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
Dep.target = null
const targetStack = []

export function pushTarget (target: ?Watcher) {
  targetStack.push(target)
  Dep.target = target
}
```

```js
value = this.getter.call(vm, vm) // 调用

updateComponent = () => {
  vm._update(vm._render(), hydrating)// 调用 render
}

vnode = render.call(vm._renderProxy, vm.$createElement) // 执行render方法
```

这个是生产的render函数，with(this) 的使用让里面不存在的变量会在this中寻找_c: createElement _stoString 

当访问值的时候，就会收集触发get方法

```js
(function anonymous(
) {
with(this){return _c('div',{attrs:{"id":"app"}},[_c('h1',[_v(_s(msg))]),_v("\n      "+_s(msg)+"\n    ")])}
})
```

![image-20201130222506441](http://picbed.sedationh.cn/image-20201130222506441.png)

```js
export function proxy (target: Object, sourceKey: string, key: string) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  }
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val
  }
  Object.defineProperty(target, key, sharedPropertyDefinition)
}
```

```js
get: function reactiveGetter () {
  const value = getter ? getter.call(obj) : val
  if (Dep.target) {
    dep.depend() // 依赖处理
    if (childOb) {
      childOb.dep.depend()
      if (Array.isArray(value)) {
        dependArray(value)
      }
    }
  }
  return value
},
  
  
  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  addDep (dep: Dep) {
    const id = dep.id
    // 不重复添加
    if (!this.newDepIds.has(id)) {
      this.newDepIds.add(id)
      this.newDeps.push(dep)
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }

```

![image-20201130223850640](http://picbed.sedationh.cn/image-20201130223850640.png)



整体来看，是在render过程中，via get 来添加依赖的