## CORE

定义对象间1 : n的依赖关系

发布订阅

发布是那个1，订阅这个发布的对象数量可以>=1

能发布的，本身是其他对象的依赖 -> Dep

响应Dep进行变化的，观察Dep -> Watcher



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

