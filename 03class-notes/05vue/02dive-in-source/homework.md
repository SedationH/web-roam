##  1、请简述 Vue 首次渲染的过程。

入口的使用是在

new Vue()处调用的，但根据使用的方式runtime-only | full 会引入不同的Vue**初始化过程**

import是从上到下 深度优先进行的 so

1. core/instance/index.js 实例成员
2. core/index.js 静态成员
3. platform/web/runtime/index.js 
4. platform/web/entry-runtime-with-compiler.js

这个是full的情况 不带runtime就去掉4的compiler

Vue顺利import进来了，通过new Vue() 调用他的构造函数

core/instace/index.js

```js
function Vue (options) {
  if (process.env.NODE_ENV !== 'production' &&
    !(this instanceof Vue)
  ) {
    warn('Vue is a constructor and should be called with the `new` keyword')
  }
  // 调用 _init() 方法
  this._init(options)
}
// 注册vm的_init()方法, 初始化vm
initMixin(Vue)
```

_init()

```js
// 合并 options
if (options && options._isComponent) {
  // optimize internal component instantiation
  // since dynamic options merging is pretty slow, and none of the
  // internal component options needs special treatment.
  initInternalComponent(vm, options)
} else {
  vm.$options = mergeOptions(
    resolveConstructorOptions(vm.constructor),
    options || {},
    vm
  )
}

...

// vm的生命周期相关变量初始化
initLifecycle(vm)
// vm的事件监听初始化,父组件绑定在当前组件上的事件
initEvents(vm)
// vm的编译render初始化
// $slots/$scopedSlots/_c/$createElement/$attrs/$listeners
initRender(vm)
// beforeCreate 生命钩子的回调
callHook(vm, 'beforeCreate')
// 把inject的成员注入到vm上
initInjections(vm) // resolve injections before data/props
// 初始化vm的 _props/methods/_data/computed/watch 进行了响应化处理
initState(vm)
// 初始化provide
initProvide(vm) // resolve provide after data/props
// created 生命钩子回调
callHook(vm, 'created')

// 最终调用 $mount() 挂载 
if (vm.$options.el) {
  vm.$mount(vm.$options.el)
}
```

在 src/platforms/web/entry-runtime-with-compiler.js 中的 vm.$mount()

- 如果用户没有传递 render 函数
- 则判断 是否传递 template
- 如果没有传递 template，则获取 el 的 outerHTML 作为 template
- 然后调用 compileToFunctions 方法将 template 转换为 render 函数
- 将 render 函数存储到 options 中
- 调用 mount 方法，挂载 DOM

在 src/platforms/web/runtime/index.js 中的 vm.$mount()

- 调用 mountComponent 方法

```js
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  ...
	callHook(vm, 'beforeMount')
  ....
  updateComponent = () => {
    vm._update(vm._render(), hydrating)
  }
  
 new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  
  			-> 跑的别的文件了 
                this.value = this.lazy
                    ? undefined
                    : this.get()
  							this.getter = expOrFn
				        value = this.getter.call(vm, vm) 这个再调用
                					updateComponent

  ...
  
	callHook(vm, 'mounted')

  return vm
```

- mountComponent()
  - 触发 beforeMount 钩子函数
  - 定义 updateComponent 方法
  - 创建 Watcher 实例，将 updateComponent 传入
    - 创建完 Watcher 实例，会调用一次 get 方法
    - get 方法中调用 updateComponent 方法
      - updateComponent 方法里面调用 vm._update(vm._render(), hydrating)方法
    - 调用 vm._render 方法，渲染虚拟 DOM
      - 调用 render.call(vm._renderProxy, vm.$createElement)返回虚拟 DOM
    - 调用 vm._update 方法，将虚拟 DOM 转换成真实 DOM
      - vm.\__patch__(prevVnode, vnode)方法挂载真实 DOM
  - 触发 mounted 钩子函数
  - 返回 vm



## 2、请简述 Vue 响应式原理。

### 前提概念 

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



### 具体实现

Vue源码中响应式的实现比较复杂，因为要考虑的比较全面，理解起来会有些吃力

核心思想是一致的

通过Watcher来更新视图 通过Dep来收集依赖

dep和数据放在一起，数据变dep.notyfy() -> 数据绑定的watcher来进行updtae

observe -> Observe ->  defineReactive 设置get & set方法 将Watcher & Dep联系起来实现响应式

通过Observe把所需要响应化的对象[key]: [value]的get set方法改变



👇来说说代码执行层面的

```js
// 将所需数据变为可响应式
// core/instance/init.js
    initState(vm)
// core/instance/state.js
    initData(vm)

// observe data
// 响应式处理
observe(data, true /* asRootData */)

// core/observer/index.js
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
			....
  else
    ob = new Observer(value)

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    // 初始化实例的 vmCount 为0
    this.vmCount = 0
    // 将实例挂载到观察对象的 __ob__ 属性
    def(value, '__ob__', this)
    // 数组的响应式处理
    if (Array.isArray(value)) {
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      // 为数组中的每一个对象创建一个 observer 实例
      this.observeArray(value)
    } else {
      // 遍历对象中的每一个属性，转换成 setter/getter
      this.walk(value)
    }
  }

 	walk (obj: Object) {
    // 获取观察对象的每一个属性
    const keys = Object.keys(obj)
    // 遍历每一个属性，设置为响应式数据
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }
    
 export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {
   const dep = new Dep()

   let childOb = !shallow && observe(val)
   
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      // 如果预定义的 getter 存在则 value 等于getter 调用的返回值
      // 否则直接赋予属性值
      const value = getter ? getter.call(obj) : val
      // 如果存在当前依赖目标，即 watcher 对象，则建立依赖
      if (Dep.target) {
        dep.depend()
        // 如果子观察目标存在，建立子对象的依赖关系
        if (childOb) {
          childOb.dep.depend()
          // 如果属性是数组，则特殊处理收集数组对象依赖
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      // 返回属性值
      return value
    },
    set: function reactiveSetter (newVal) {
      // 如果预定义的 getter 存在则 value 等于getter 调用的返回值
      // 否则直接赋予属性值
      const value = getter ? getter.call(obj) : val
      // 如果新值等于旧值或者新值旧值为NaN则不执行
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      /* eslint-enable no-self-compare */
      if (process.env.NODE_ENV !== 'production' && customSetter) {
        customSetter()
      }
      // 如果没有 setter 直接返回
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      // 如果预定义setter存在则调用，否则直接更新新值
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      // 如果新值是对象，观察子对象并返回 子的 observer 对象
      childOb = !shallow && observe(newVal)
      // 派发更新(发布更改通知)
      dep.notify()
    })
```



强调一下如何实现dep与Watcher的链接的 要理解上面只是建立了联系的方式set get

真正联系起来是getter被调用的时候,也就是进行mount的时候

```js
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}

export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {

  ...
  
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)

export default class Watcher {
  vm: Component;
  expression: string;
  cb: Function;
  
  ...
  
    this.value = this.lazy
      ? undefined
      : this.get()
  
  get () {
    // Watcher对象
    pushTarget(this)
    
    value = this.getter.call(vm, vm)
updateComponent -> render中
    
   (function anonymous(
) {
with(this){return _c('div',{attrs:{"id":"app"}},[_c('h1',[_v(_s(msg))]),_v("\n      "+_s(msg)+"\n    ")])}
})
    这个时候访问了data -> getter被调用
```

这个过程还通过异步 queue进行视图一起更新 所以整体debug比较困难

1. 在 defineReactive() 的 getter 中创建 dep 对象，当存在 Dep.target , 调用 dep.depend()
2. dep.depend() 内部调用 Dep.target.addDep(this)，也就是 watcher 的 addDep() 方法，它内部最终调用 dep.addSub(this)，把订阅者（Watcher）添加到 dep 的 subs 数组中，当数据变化的时候调用 watcher 对象的 update() 方法
3. 什么时候设置的 Dep.target? 通过简单的案例调试观察。调用 mountComponent() 方法的时候，创建了渲染 watcher 对象，执行 watcher 中的 get() 方法
4. get() 方法内部调用 pushTarget(this)，把当前 Dep.target = watcher，同时把当前 watcher 入栈，因为有父子组件嵌套的时候先把父组件对应的 watcher 入栈，再去处理子组件的 watcher，子组件的处理完毕后，再把父组件对应的 watcher 出栈，继续操作
5. Dep.target 用来存放目前正在使用的 watcher。全局唯一，并且一次也只能有一个 watcher 被使用



- Watcher
  - dep.notify 方法中调用 watcher 对象的 update 方法
  - queueWatcher 方法判断 watcher 是否已处理，如果没有的话，则添加到 queue 队列中，并调用 flushSchedulerQueue 方法
- flushSchedulerQueue()
  - 触发 beforeUpdate 钩子函数
  - 调用 watcher 中的 run 方法更新视图
  - 触发 actived 钩子函数
  - 触发 updated 钩子函数



## 3、请简述虚拟 DOM 中 Key 的作用和好处。

尽可能复用DOM节点



## 4、请简述 Vue 中模板编译的过程。

ast -> optimize -> generate -> createFn



![image-20201214211202118](http://picbed.sedationh.cn/image-20201214211202118.png)

![图1](http://picbed.sedationh.cn/image-20201214210348666.png)

![图2](http://picbed.sedationh.cn/image-20201214210842484.png)

