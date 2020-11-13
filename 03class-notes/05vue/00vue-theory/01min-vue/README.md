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

断点打在较为难理解的watcher

```js
    Dep.target = this 
```

就好

下面两张图好好理解

![image-20201113164227062](http://picbed.sedationh.cn/image-20201113164227062.png)

![image-20201113164051070](http://picbed.sedationh.cn/image-20201113164051070.png)

