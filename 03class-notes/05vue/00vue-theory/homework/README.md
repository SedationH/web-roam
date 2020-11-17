## 一

## 1

```js
let vm = new Vue({
 el: '#el'
 data: {
  o: 'object',
  dog: {}
 },
 method: {
  clickHandler () {
   // 该 name 属性是否是响应式的
   this.dog.name = 'Trump'
  }
 }
})
```

不是

2.x通过

```js
defineReactive(obj, key, val) {
  // 如果val是对象，递归让val里面的数据也变为响应式
  this.walk(val)
  const that = this
  const dep = new Dep()
  Reflect.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      // 收集依赖 只有
      Dep.target && dep.addSub(Dep.target)

      // 这里如果通过obj[key] 来调用 会发生没有出口的递归
      return val
    },
    set(newValue) {
      if (newValue === val) return
      val = newValue
      // 如果设置的新属性是对象的话，还需要走一遍
      that.walk(newValue)
      // 发送通知
      dep.notify()
    },
  })
}
```

为指定对象的指定key设置为reactive,如果value中存在对象那么进行递归设置，可name在原来的dog对象中不存在这个key，也就没有与之对象的响应式监视



通过特定的方法 $.set()... 或者写成

```js
clickHandler () {
  // 该 name 属性是否是响应式的
  this.dog = {
    name: 'Trump'
  }
}
```

### 2

diff 算法的执行过程

好复杂，我学不动了= = 

[snabbdom和vue中dom-diff实现原理流程](https://juejin.im/post/6844904078196097031#heading-33)

## 二

 Vue router hash 实现

```html
<!DOCTYPE html>
<html lang="en">
  <body>
    <ul>
      <ul>
        <!-- 定义路由 -->
        <li><a href="#/home">home</a></li>
        <li><a href="#/about">about</a></li>

        <!-- 渲染路由对应的 UI -->
        <div id="routeView"></div>
      </ul>
    </ul>
  </body>
  <script>
    let routerView = routeView
    window.addEventListener("hashchange", () => {
      let hash = location.hash
      routerView.innerHTML = hash
    })
    window.addEventListener("DOMContentLoaded", () => {
      if (!location.hash) {
        //如果不存在hash值，那么重定向到#/
        location.hash = "/"
      } else {
        //如果存在hash值，那就渲染对应UI
        let hash = location.hash
        routerView.innerHTML = hash
      }
    })
  </script>
</html>
```



v-html

```js
// handle v-html
htmlUpdater(node, value, key) {
  node.innerHTML = value

  new Watcher(this.vm, key, (newvalue) => {
    node.innerHTML = newvalue
  })
}
```

 v-on

```js
onUpdater(node, value, key) {
  // 先拿到vm中的函数
  const invokeFn = this.vm.$method[key]

  node.addEventListener("click", () => {
    invokeFn && invokeFn.call(this.vm)
  })
}
```

```js
constructor(options) {
    // 通过属性保存选择的数据
    this.$options = options || {}
    this.$data = options.data || {}
+   this.$method = options.method || {}
    this.$el =
      typeof options.el === "string"
        ? document.querySelector(options.el)
        : options.el
    // 把dat中的成员转换为getter和setter,注入vue实例中
    this._proxyData(this.$data)
    // 调用observer对象，监听$data的变化
    new Observer(this.$data)
    // 调用compiler对象，解析指令和mustache语法
    new Compiler(this)
  }
```

[利用Snabbdom 实现电影列表的示例](../02virtualDOM/01movie-snabbdom)

