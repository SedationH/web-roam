## JS中的单例模式

在传统面向对象语言中的实现，对象是由类而来。比如Java中，如果需要某个对象，就要先定义一个类，对象总是从类中创建而来。



但JS是一门class-free语言，JS中对象创建并不依赖类，声称对象的方式很简单



**单例模式的核心是确保只有一个实例，并提供全局访问**



在JS中的全局创建变量要注意命名污染

- 闭包
- 对象创建命名空间



根据实例启动就创建的

- 是 非惰性
- 否 惰性



考虑以下应用场景



管理页面上唯一的登录框

事件只需要绑定在dom上一次

...



涉及的原则和考虑

单一职责原则

保持单例和创建对象进行分离

其中运用了代理模式

利用JS中闭包的特性



## CODE

```html
需求 实现创建唯一的DIV元素
<script>
// 1. 简单实现
// 提供特殊的静态方法进行调用
;(function () {
  function createDiv(name) {
    this.name = name
    this.instance = null
  }

  createDiv.prototype.getName = function () {
    console.log(this.name)
    return this.name
  }

  createDiv.getInstance = function (name) {
    return (this.instance = this.instance
      ? this.instance
      : new createDiv(name))
  }

  const foo = createDiv.getInstance('foo')
  const bar = createDiv.getInstance('bar')

  console.log(bar === foo)
})

// 1. 增加透明性 即不需要用户知道getInstance方法
// 使用new就可以进行创建
;(function () {
  function createDiv(name) {
    this.name = name
    if (!createDiv.instance) {
      createDiv.instance = this
    } else {
      return createDiv.instance
    }
  }

  const foo = new createDiv('foo')
  const bar = new createDiv('bar')

  console.log(foo === bar)
})

// 利用立刻执行函数和闭包
;(function () {
  const createDiv = (function () {
    let instance = null

    // 起到两个作用
    // 保持单例
    // 调用init
    // 单一职责原则 想办法调出init
    function createDiv(html) {
      if (instance) return instance
      instance = this
      this.html = html
      this.init()
    }

    createDiv.prototype.init = function () {
      const $div = document.createElement('div')
      $div.innerHTML = this.html
      document.body.append($div)
    }

    return createDiv
  })()

  const foo = new createDiv('<h1>foo</h1>')
  const bar = new createDiv('<h1>bar</h1>')

  console.log(foo === bar)
})

// 目前需要分离操作和保持实例的唯一两个需求
// 通过引入代理类
// 代理类来控制单一
// 函数来进行操作
;(function () {
  function createDiv(html) {
    this.html = html
    this.init()
  }

  createDiv.prototype.init = function () {
    const $div = document.createElement('div')
    $div.innerHTML = this.html
    document.body.append($div)
  }

  function proxySingletonCreateDiv(html) {
    if (proxySingletonCreateDiv.instance)
      return proxySingletonCreateDiv.instance
    return (proxySingletonCreateDiv.instance = new createDiv(html))
  }

  const foo = new proxySingletonCreateDiv('<h1>foo</h1>')
  const bar = new proxySingletonCreateDiv('<h1>bar</h1>')

  console.log(foo === bar)
})

// 更加通用的惰性单例
// 思路
// 还是要保持单一职责原则
// 不同需求的操作各不相同，但是单一的实例需求是共通的，都有以下的逻辑
// {
//   let obj = undefined
//   if(!obj){
//     // 生成
//   }
//   return obj
// }
;(function () {
  // 通过传入需要进行单例化的操作函数
  function getSingle(fn) {
    let instance
    return (...args) =>
      instance ? instance : (instance = fn(...args))
  }

  function createLoginDiv(text) {
    const $div = document.createElement('div')
    $div.innerHTML = text
    document.body.append($div)
    return $div
  }

  const createSingleLoginDiv = getSingle(createLoginDiv)

  document.body.addEventListener('click', () => {
    const $loginDiv = createSingleLoginDiv('hi')
    $loginDiv.style.display = 'block'
  })
})()
</script>

```

