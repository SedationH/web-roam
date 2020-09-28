注意内容

- 标签模版字符串
- 参数默认值
- object计算属性
- asign is
- proxy
- reflect
- for of iterator

## let & const

```js
// 问题
var elements = [{}, {}, {}]
for (var i = 0; i < elements.length; i++) {
  elements[i].onclick = function () {
    console.log(i)
  }
}
elements[2].onclick() //3

// 闭包解决
// 其实也就是使用function创建一个执行上下文，维护所需的变量
var elements = [{}, {}, {}]
for (var i = 0; i < elements.length; i++) {
  elements[i].onclick = (function (i) {
    return function () {
      console.log(i)
    }
  })(i)
}
elements[0].onclick()

// ES在语法层面解决这个问题
// debug可以看到 scope中 中有 block
var elements = [{}, {}, {}]
for (let i = 0; i < elements.length; i++) {
  elements[i].onclick = function () {
    console.log(i)
  }
}
elements[0].onclick()
```

```js
// for 循环会产生两层作用域 ----------------------------------

for (let i = 0; i < 3; i++) {
  let i = 'foo'
  // 断点这里看能看到scope 中有 两个block
  console.log(i) //foo
}

// 等价于
{
  let i = 0

  while (i++ < 3) {
    let i = 'foo'
    console.log(i)
  }
}
```

```js
// const要求声明的同时赋值
// 不允许再修改指向的地址
```

最佳实践： 能const不用let ，不使用var

## 对象

```js
const obj = {
  // 通过 [] 让表达式的结果作为属性名
  [Math.random()] : 123
}

console.log(
  // 0 == false              // => true
  // 0 === false             // => false
  // +0 === -0               // => true
  // NaN === NaN             // => false
  // Object.is(+0, -0)       // => false
  // Object.is(NaN, NaN)     // => true
)
```



## Proxy

为对象的读写添加了一层代理

```js
const person = {
  name: 'zce',
  age: 20
}

const personProxy = new Proxy(person, {
  // 监视属性读取
  get(target, property) {
    console.log('get', target, property)
    return 100
  },
  // 监视属性设置
  set(target, property, value) {
    target[property] = value
    console.log('set', target, property, value)
    return 1 // 无用
  }
})

console.log(
  personProxy.age,
  personProxy.name = 'seda'
)

// get { name: 'zce', age: 20 } age
// set { name: 'seda', age: 20 } name seda
// 100 seda
```

```js
// Proxy 对比 Object.defineProperty() ===============

// 优势1：Proxy 可以监视读写以外的操作 --------------------------

const person = {
  name: 'zce',
  age: 20
}

const personProxy = new Proxy(person, {
  deleteProperty(target, property) {
    console.log('delete', target, property)
    delete target[property]
  }
})

delete personProxy.age
// delete { name: 'zce', age: 20 } age

// 优势2：Proxy 可以很方便的监视数组操作 --------------------------

const list = []

const listProxy = new Proxy(list, {
  set(target, property, value) {
    console.log('set', target, property, value)
    target[property] = value
    return true // 表示设置成功
  }
})
// 关于set要返回true
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/Proxy/set

listProxy.push(100)
listProxy.push(100)
// set [] 0 100
// set [ 100 ] length 1
// set [ 100 ] 1 100
// set [ 100, 100 ] length 2

// 优势3：Proxy 不需要侵入对象 --------------------------

// const person = {}

// Object.defineProperty(person, 'name', {
//   get () {
//     console.log('name 被访问')
//     return person._name
//   },
//   set (value) {
//     console.log('name 被设置')
//     person._name = value
//   }
// })
// Object.defineProperty(person, 'age', {
//   get () {
//     console.log('age 被访问')
//     return person._age
//   },
//   set (value) {
//     console.log('age 被设置')
//     person._age = value
//   }
// })
```



## Reflect

All properties and methods of `Reflect` are static (just like the Math object).

封装了一系列对对象的操作

Reflect成员方法就是Proxy处理对象的默认实现

```js
const proxy = new Proxy(obj, {
  get(target, property) {
    console.log('watch logic~')
    return Reflect.get(target, property)
  }
})
```

统一提供一套用于操作对象的API的方法

对于对象的操作有操作符 也有 调用Object.x()



## [Symbol](https://javascript.info/symbol)

To create a new primitive symbol, you write `Symbol()` with an optional string as its description:

Symbol 有两个主要的使用场景：

1. “隐藏” 对象属性。 如果我们想要向“属于”另一个脚本或者库的对象添加一个属性，我们可以创建一个 Symbol 并使用它作为属性的键。Symbol 属性不会出现在 `for..in` 中，因此它不会意外地被与其他属性一起处理。并且，它不会被直接访问，因为另一个脚本没有我们的 symbol。因此，该属性将受到保护，防止被意外使用或重写。

   因此我们可以使用 Symbol 属性“秘密地”将一些东西隐藏到我们需要的对象中，但其他地方看不到它。

2. JavaScript 使用了许多系统 Symbol，这些 Symbol 可以作为 `Symbol.*` 访问。我们可以使用它们来改变一些内置行为。例如，在本教程的后面部分，我们将使用 `Symbol.iterator` 来进行 [迭代](https://zh.javascript.info/iterable) 操作，使用 `Symbol.toPrimitive` 来设置 [对象原始值的转换](https://zh.javascript.info/object-toprimitive) 等等。

## iterator

> ES中能够表示有结构的数据类型越来越多,了给各种各样的数据结构提供统一遍历方式,ES2015提供了Iterable接口 for of 就是在整个iterable接口上的语法封装

```js
// 遍历 Map 可以配合数组结构语法，直接获取键值

const m = new Map()
m.set('foo', '123')
m.set('bar', '345')

for (const [key, value] of m) {
  console.log(key, value)
}

// 普通对象不能被直接 for...of 遍历

const obj = { foo: 123, bar: 456 }

for (const item of obj) {
  console.log(item)
}
// 是因为后者没有实现 iterator 接口
```

```js

const set = new Set(['foo', 'bar', 'baz'])

const iterator = set[Symbol.iterator]()

console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())
console.log(iterator.next())

// { value: 'foo', done: false }
// { value: 'bar', done: false }
// { value: 'baz', done: false }
// { value: undefined, done: true }
// { value: undefined, done: true }
```

改造普通的obj

```js
const obj = {
  [Symbol.iterator]: function () {
    return {
      next: function () {
        return {
          value: 'zce',
          done: true
        }
      }
    }
  }
}
// 这里写死了done

const obj = {
  store: ['foo', 'bar', 'baz'],

  [Symbol.iterator]: function () {
    let index = 0
    const self = this

    return {
      next: function () {
        const result = {
          value: self.store[index],
          done: index >= self.store.length
        }
        index++
        return result
      }
    }
  }
}
```

注意以下的语言描述：

obj实现了iterable接口，这个接口要求对象实现[Symbol.iterator]方法

[Symbol.iterator]方法返回的对象实现了iterator接口(内部要有一个用于迭代的next方法)

next方法返回的对象实现了IterationResult接口(value & done)

接口就是一种规范，三个规范的共同作用下，我们能够通过for of 统一便捷的拿到各种数据接口的数据(set map array)



再抽象一下，迭代器模式（降低Coupling），数据的获取不需要硬编码，负责存储的数据的代码模块向外暴露统一的获取接口

```js

// 场景：你我协同开发一个任务清单应用

// 我的代码 ===============================

const todos = {
  life: ['吃饭', '睡觉', '打豆豆'],
  learn: ['语文', '数学', '外语'],
  work: ['喝茶'],

  // 提供统一遍历访问接口
  each: function (callback) {
    const all = [].concat(this.life, this.learn, this.work)
    for (const item of all) {
      callback(item)
    }
  },

  // 提供迭代器（ES2015 统一遍历访问接口）
  [Symbol.iterator]: function () {
    const all = [...this.life, ...this.learn, ...this.work]
    let index = 0
    return {
      next: function () {
        return {
          value: all[index],
          done: index++ >= all.length
        }
      }
    }
  }
  // 这里还可以利用generate函数进行优化
  [Symbol.iterator]: function * () {
    const all = [...this.life, ...this.learn, ...this.work]
    for (const item of all) {
      yield item
    }
  }
}

// 你的代码 ===============================

// for (const item of todos.life) {
//   console.log(item)
// }
// for (const item of todos.learn) {
//   console.log(item)
// }
// for (const item of todos.work) {
//   console.log(item)
// }

todos.each(function (item) {
  console.log(item)
})

console.log('-------------------------------')

for (const item of todos) {
  console.log(item)
}

```



## 碎

### destruct 解构

数组 or 对象均有

```js
// const [foo, bar, baz = 123, more = 'default value'] = arr
// const [foo, ...rest] = arr

// const obj = { name: 'sed', age: 18 }
// const { name } = obj
// const { name: objName } = obj
// const { name: objName = 'jack' } = obj
// const { log } = console
```

### 模版字符串

```js
const name = 'tom'
const gender = false

// 可以通过 ${} 插入表达式，表达式的执行结果将会输出到对应位置
const msg = `hey, ${name} --- ${1 + 2} ---- ${Math.random()}`

function myTagFunc (strings, name, gender) {
  console.log(strings, name, gender)
  return '123'
  const sex = gender ? 'man' : 'woman'
  return strings[0] + name + strings[1] + sex + strings[2]
}

const result = myTagFunc`hey, ${name} is a ${gender}.`

console.log(result)
// [ 'hey, ', ' is a ', '.' ] tom false
// 123
```

