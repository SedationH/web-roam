## CORE

定义对象间1 : n的依赖关系

发布订阅

发布是那个1，订阅这个发布的对象数量可以>=1

能发布的，本身是其他对象的依赖 -> Dep

响应Dep进行变化的，观察Dep -> Watcher



是一种用于构建通讯关系的设计模式



场景

异步编程

生命周期，插件机制....



> 发布订阅模式可以取代对象之间硬编码的通知机制，一个对象不用再显示地调用另外一个对象的某个接口。
>
> 通讯的双方(1-n ...)  认同一种模式、契约。



事件步骤

- 实现

EventTarget 可支持



## EventTarget

**`EventTarget`** is a DOM interface implemented by objects that can receive events and may have listeners for them.

[`Element`](https://developer.mozilla.org/en-US/docs/Web/API/Element), [`Document`](https://developer.mozilla.org/en-US/docs/Web/API/Document), and [`Window`](https://developer.mozilla.org/en-US/docs/Web/API/Window) are the most common event targets, but other objects can be event targets, too. For example [`XMLHttpRequest`](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest), [`AudioNode`](https://developer.mozilla.org/en-US/docs/Web/API/AudioNode), [`AudioContext`](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext), and others.



```js
var EventTarget = function () {
  this.listeners = {}
}

EventTarget.prototype.listeners = null
EventTarget.prototype.addEventListener = function (
  type,
  callback
) {
  if (!(type in this.listeners)) {
    this.listeners[type] = []
  }
  this.listeners[type].push(callback)
}

EventTarget.prototype.removeEventListener = function (
  type,
  callback
) {
  if (!(type in this.listeners)) {
    return
  }
  var stack = this.listeners[type]
  for (var i = 0, l = stack.length; i < l; i++) {
    if (stack[i] === callback) {
      stack.splice(i, 1)
      return
    }
  }
}

EventTarget.prototype.dispatchEvent = function (event) {
  if (!(event.type in this.listeners)) {
    return true
  }
  var stack = this.listeners[event.type].slice()

  for (var i = 0, l = stack.length; i < l; i++) {
    stack[i].call(this, event)
  }
  return !event.defaultPrevented
}
```

