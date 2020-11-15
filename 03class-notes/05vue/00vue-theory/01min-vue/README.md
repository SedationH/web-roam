## Overview

- 数据驱动
- 响应式核心原理
- 发布订阅模式和观察者模式



## 数据驱动

- 数据响应式 ：不需要关心DOM操作
- 双向绑定 ：视图和数据
- 数据驱动：只用关心数据来实现业务



[Reactivity in Depth V2](https://vuejs.org/v2/guide/reactivity.html)

> v2中 使用 defineProperty来进行响应式的实现
>
> When you pass a plain JavaScript object to a Vue instance as its `data` option, Vue will walk through all of its properties and convert them to [getter/setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects#Defining_getters_and_setters) using [`Object.defineProperty`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). This is an ES5-only and un-shimmable feature, which is why Vue doesn’t support IE8 and below.



defineProperty对于特定对象的特定属性，可以进行定制化配置，比如当设置对象的某个熟悉的时候做些别的操作，这样的效果

参考 [00defineProperty.html](./00defineProperty.html)



[Reactivity in Depth V3](https://v3.vuejs.org/guide/reactivity.html#reactivity-in-depth)

> When you pass a plain JavaScript object to an application or component instance as its `data` option, Vue will walk through all of its properties and convert them to [Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy) using a handler with getters and setters. This is an ES6-only feature, but we offer a version of Vue 3 that uses the older `Object.defineProperty` to support IE browsers. Both have the same surface API, but the Proxy version is slimmer and offers improved performance.

较于defineProperty，新加入data中的key也可以通过proxy再监听到，更加完善和易于使用

由浏览器负责优化，比defineProperty性能更好

参考 [01proxy.html](./01proxy.html)



## 发布订阅模式和观察者模式

两个模式都是在处理事件与相应事件的问题

- 发布订阅模式  有事件中心   对象之间少依赖  通过使用一个事件中心，不用声明依赖对象
- 观察者模式  对象之间有依赖（指定观察谁）

![image-20201107110312541](http://picbed.sedationh.cn/image-20201107110312541.png)

Vue中自定义事件

``` js
// Vue 自定义事件
let vm = new Vue()
// { 'click': [fn1, fn2], 'change': [fn] }

// 注册事件(订阅消息)
vm.$on("dataChange", () => {
  console.log("dataChange")
})

vm.$on("dataChange", () => {
  console.log("dataChange1")
})
// 触发事件(发布消息)
vm.$emit("dataChange")
```

模仿实现

```js
class EventEmitter {
  constructor() {
    // create是以某个原型作为对象创建对象，null表示没有原型
    // 性能更好
    this.subs = Object.create(null)
  }

  // 注册事件
  $on(eventType, handler) {
    this.subs[eventType] = this.subs[eventType] || []
    this.subs[eventType].push(handler)
  }

  // 触发事件
  $emit(eventType) {
    if (this.subs[eventType]) {
      this.subs[eventType].forEach((handler) => {
        handler()
      })
    }
  }
}

// 测试
// 事件中心
let em = new EventEmitter()

// 发布者向事件中心发布事件
const publisher = {
  publish() {
    em.$emit("click")
  },
}

// 响应事件
const subscriber = {
  subscribe() {
    em.$on("click", () => {
      console.log("click1")
    })
    em.$on("click", () => {
      console.log("click2")
    })
  },
}

subscriber.subscribe()
publisher.publish()
```

观察者

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



## vue中响应式实现

墙裂建议debug看一下函数调用栈，真的就什么都明白了

断点打在较为难理解的watcher调用前

```js
node.textContent = value.replace(
  pattern,
  this.vm[key]
)

// 创建watcher对象，当数据改变的时候更新视图
new Watcher(this.vm, key, (newvalue) => {
  node.textContent = newvalue
})
```

就好

![image-20201114095420382](http://picbed.sedationh.cn/image-20201114095420382.png)

遇到Mustache语法，第一次进行替换的时候，创建Watcher

![image-20201114095618318](http://picbed.sedationh.cn/image-20201114095618318.png)

在watcher的构造函数内部，this指向本watcher实例，挂到Dep类上

使用vm[key]会调用 相关key的geter方法

![image-20201114100222227](http://picbed.sedationh.cn/image-20201114100222227.png)

可以看到此时就有值了，有趣的是，我整体使用module模式，在Watche module中给Dep类上挂的内容，在compile.js中仍然可以拿到，这里是自己不熟悉的地方

可以感受一下从开始处理Mastache语法的时候，到真正添加到dep 中 subs 的函数函数调用栈

![image-20201114100516674](http://picbed.sedationh.cn/image-20201114100516674.png)



```html
<h3>{{ count }}</h3>    
<h3>{{ count }}</h3>
<input type="text" v-model="count" />
```

如果有这三个个，那么在第一次编译后

$data.count属性的实际的watcher有

![image-20201114105353194](http://picbed.sedationh.cn/image-20201114105353194.png)

![image-20201114105608967](http://picbed.sedationh.cn/image-20201114105608967.png)

这个元素上也有相关的input事件来进行监听



**重点摘要**

```js
 // vm[key] 访问了get 方法 这个时候就添加了watcher
// get() {
//   // 收集依赖 只有
//   Dep.target && dep.addSub(Dep.target)

//   // 这里如果通过obj[key] 来调用 会发生没有出口的递归
//   return val
// },
this.oldValue = vm[key]

// 对于Dep.target的理解
// 这里注意两个前提条件
// 创建新的observer对象的时候会在Dep.target上挂上oberser的实例
// 使用Dep.target的时机是在所有访问vm[key]的时候都要走的判断
// 但我们只需要添加一个watcher就好了，下面 null 就完成了这个效果
// 整体来看，我们通过在第一次替换Mastache的时候，进行了Watcher的创建，通过该属性的
// getter方法来向这个属性的dep实例的subs中添加上面创建的watcher
Dep.target = null
```



下面两张图好好理解

![image-20201113164227062](http://picbed.sedationh.cn/image-20201113164227062.png)

![image-20201113164051070](http://picbed.sedationh.cn/image-20201113164051070.png)



总结

![image-20201114091639926](http://picbed.sedationh.cn/image-20201114091639926.png)


