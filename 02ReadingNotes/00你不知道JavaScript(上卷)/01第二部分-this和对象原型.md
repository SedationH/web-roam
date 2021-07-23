## this认识

this的绑定和函数声明的位置没有任何关系，只取决于函数的调用方式。



当一个函数被调用时，会创建一个活动记录（执行上下文EC）

EC包含

- 调用栈

- 哪一个函数？具体入参？

- this



## this解析

### 绑定规则



#### 默认绑定

```js
globalThis.name = 'window'
function foo() {
  console.log(this.name)
}
foo()
```

这里注意

"use strict";

严格模式下，**global** 进行的调用 this 为 undefined



为什么要强调global呢？

因为在node环境下setTimeout中的函数并不是由global进行调用的

```js
'use strict'
globalThis.name = 'foo-winodw'
function foo() {
  setTimeout(function () {
    console.log(this)
  }, 0)
}
foo()


Timeout { 
  _idleTimeout: 1, 
  _idlePrev: null, 
  _idleNext: null, 
  _idleStart: 538, 
  _onTimeout: [Function (anonymous)], 
  _timerArgs: undefined, 
  _repeat: null, 
  _destroyed: false, 
  [Symbol(refed)]: true, 
  [Symbol(kHasPrimitive)]: false, 
  [Symbol(asyncId)]: 27, 
  [Symbol(triggerId)]: 20 
} 
```



#### 隐式绑定

obj.foo()

this 指向obj

obj['foo'] 也一样



这是如果要尝试自己手写实现的一切基础



#### 显示绑定

call apply

```js
const obj = {
  name: 'obj',
}

function getName() {
  console.log(this.name)
}

getName.call(obj)
```

如果传入一个原始值如 'str' => new String('str') 装箱



API调用的上下文中，就有这个运用

```js
function f(el) {
  console.log(el, this.name)
}

const foo = {
  name: 'foo',
}
;[1, 2, 3].forEach(f, foo)


1 'foo'
2 'foo' 
3 'foo'
```



但如果使用的是箭头函数

```js
function f(el) {
  console.log(el, this.name)
}

const foo = {
  name: 'foo',
}
;[1, 2, 3].forEach(el => {
  console.log(el, this.name)
}, foo)

1 undefined
2 undefined 
3 undefined
```

#### new 绑定

事实上并不存在构造函数，只有对函数的构造调用



### 手写实现

涉及内容

apply call bind new softBind

```js
Function.prototype.sortBind = function (thisArg, ...argsArray) {
  const fn = this
  return function WrapedFn(...newArgsArray) {
    const constructor = WrapedFn
    const obj = this
    // 参与了隐式绑定
    if (obj !== globalThis || obj !== undefined) {
      thisArg = obj
    }
    if (obj instanceof constructor) {
      thisArg = obj
    }
    fn.apply(thisArg, argsArray.concat(newArgsArray))
  }
}

Function.prototype.myBind = function (thisArg, ...argsArray) {
  const fn = this
  return function WrapedFn(...newArgsArray) {
    // 当 new 进来的时候 WrapedFn 和 this(相当于newOp实现中的obj) 是有联系的
    const constructor = WrapedFn
    const obj = this
    if (obj instanceof constructor) {
      thisArg = obj
    }
    fn.apply(thisArg, argsArray.concat(newArgsArray))
  }
}

Function.prototype.myCall = function (thisArg, ...argsArray) {
  const fn = this
  const fnName = Symbol('fnName')
  const obj = thisArg
  obj[fnName] = fn
  const result = obj[fnName](...argsArray)

  delete obj[fnName]

  return result
}

Function.prototype.myApply = function (thisArg, argsArray) {
  const fn = this
  return fn.myCall(thisArg, ...argsArray)
}

globalThis.name = 'window-name'
const foo = {
  name: 'foo',
  getName: function () {
    console.log(this.name)
  },
}

function fn(a, b) {
  console.log(this.name, a + b)
  this.age = b
  // return {}
}

// fn() // window-name
// fn.call(foo) // foo

// fn.myCall(foo, 1, 2)

// fn.apply(foo, [1, 2])

// fn.myApply(foo, [1, 2])

const bar = fn.bind(foo, 1, 2)
// bar()
const car = fn.myBind(foo, 1)
// car(2)

// 再实现一个new
function newOp(constructor, ...argsArray) {
  // 创建一个新对象
  const obj = {}
  // 连接原型
  Reflect.setPrototypeOf(obj, constructor.prototype)
  // 使用构造函数初始化
  const result = constructor.apply(obj, argsArray)
  // 依据结果返回
  return result instanceof Object ? result : obj
}

// const obj1 = new fn(1, 2)
// const obj2 = newOp(fn, 1, 2)

// console.log(obj1 instanceof fn, obj2 instanceof fn, {} instanceof fn)
// true true fasle

// const obj3 = new bar()
// obj3
// const obj4 = newOp(car, 2)
// obj4

// 手写实现还是不太完善，尤其是new 和 bind 这里 感觉走判定都应该走 最初的函数
// 要实现这个效果，要支持可以通过wraped函数自动拿到原函数

// 软绑定的需求，在完成bind效果后，支持隐式绑定
// 即
const fun = {
  bar: bar,
  name: 'fun',
}

// fun.bar() // foo
const ken = fn.sortBind(foo)

const funny = {
  ken: ken,
  name: 'funny',
}

funny.ken(1, 2)

```

### 杂

bind 还能用于缓存参数



如果担心在非严格模式下 null  -> this -> globalThis 产生莫名其妙的影响

可以创建个Object.create(null)

Object.create实现 

[参考](https://www.programmersought.com/article/14335601617/)

```js
Object.myCreate = function (proto) {
  function fn() {}
  fn.prototype = proto
  const obj = new fn()
  if (proto === null) {
    obj.__proto__ = null
  }
  return obj
}

const foo = {
  name: 'foo',；
}

const o1 = Object.create(foo)
const o11 = Object.create(null)

console.log(o1.__proto__.name, o11)

const o2 = Object.myCreate(foo)
const o22 = Object.myCreate(null)

console.log(o2.__proto__.name, o22)

```



箭头函数的this是创建箭头函数的函数的环境this

用 self = this 也能完成一样的效果



##  对象



### JS 中的数据类型有

- string
- number
- boolean
- undefined
- null
- object



后面又引入了 symbol bigint



除了object外，别的都是primitive value 他们具有 不可变的特性

看似可以对 1.toFix(2) "123".toString() 这样的 primitive 属性可以调用 方法，是引擎使用了自动装箱类似的操作



### 对象 和 访问

对象实际就是key value 的集合





对象有两种访问方式 

1. `.`
2.  `[]`

前者要求属性名满足标识符的命名规范

后者UTF8即可





### object 有很多对象子类型

Function Array String ...

function 从技术上来说就是可以call 可以调用的对象



```js
const str = 'foo'
const obj = String()
const obj2 = new String()

const res1 = str instanceof String // false
res1

const res2 = obj instanceof String // false
res2

const res3 = obj2 instanceof String // true
res3

function myInstanceOf(instance, constructor) {
  const targetPrototype = constructor.prototype

  try {
    // consider -> [TypeError: Reflect.getPrototypeOf called on non-object]
    let currPrototype = Reflect.getPrototypeOf(instance)
    while (
      currPrototype !== null &&
      currPrototype !== targetPrototype
    ) {
      currPrototype = Reflect.getPrototypeOf(currPrototype)
    }
    const flag = currPrototype === targetPrototype
    flag
    return currPrototype === targetPrototype
  } catch (error) {
    error
    return false
  }
}

myInstanceOf(str, String)
```



### 对象描述符

Reflect.defineProperty()

Reflect.getOwnPropertyDescriptor()



对象是 key : property的集合

property 有数据 和 访问器两种可能

#### **数据属性的特性(Attributes of a data property)**

| 特性             | 数据类型           | 描述                                                         | 默认值    |
| :--------------- | :----------------- | :----------------------------------------------------------- | :-------- |
| [[Value]]        | 任何Javascript类型 | 包含这个属性的数据值。                                       | undefined |
| [[Writable]]     | Boolean            | 如果该值为 `false，`则该属性的 [[Value]] 特性 不能被改变。   | false     |
| [[Enumerable]]   | Boolean            | 如果该值为 `true，`则该属性可以用 [for...in](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in) 循环来枚举。 | false     |
| [[Configurable]] | Boolean            | 如果该值为 `false，`则该属性不能被删除，并且 除了 [[Value]] 和 [[Writable]] 以外的特性都不能被改变。**而且对Writable的更改只能从true -> false 饭回来不可以** | false     |

```js
const foo = {}

Reflect.defineProperty(foo, 'name', {
  value: 'foo',
  writable: false,
  configurable: false,
  enumerable: true,
})

foo

foo.name = 'change'

foo

Reflect.defineProperty(foo, 'name', {
  writable: true,
})

const res = Reflect.getOwnPropertyDescriptor(foo, 'name')
res
// { 
//   value: 'foo',
//   writable: false,
//   enumerable: true,
//   configurable: false 
// }
```



#### 访问器属性

访问器属性有一个或两个访问器函数 (get 和 set) 来存取数值，并且有以下特性:

| 特性             | 类型                   | 描述                                                         | 默认值    |
| :--------------- | :--------------------- | :----------------------------------------------------------- | :-------- |
| [[Get]]          | 函数对象或者 undefined | 该函数使用一个空的参数列表，能够在有权访问的情况下读取属性值。另见 `get。` | undefined |
| [[Set]]          | 函数对象或者 undefined | 该函数有一个参数，用来写入属性值，另见 `set。`               | undefined |
| [[Enumerable]]   | Boolean                | 如果该值为 `true，则该属性可以用` [for...in](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in) 循环来枚举。 | false     |
| [[Configurable]] | Boolean                | 如果该值为 `false，则该属性不能被删除，并且不能被转变成一个数据属性。` | false     |

```js
const foo = {
  get name() {
    return 'foo'
  },
}

Reflect.defineProperty(foo, 'bar', {
  get() {
    return 'bar'
  },
})

console.log(foo.name, foo.bar)
```



### 不变性

强度一点一点增大

动 defineProperty中 设置 configurable: false 指定对象的单一属性不可变



不让对象新增新的属性（扩展）

`Reflect.preventExtensions`

```js
const foo = {}

Reflect.preventExtensions(foo)

foo.name = 'foo'

foo // {}
```



`Object.seal`  = `Reflect.preventExtensions` + for in `defineProperty` -> `configurable: false`



`Object.freeze` = `Object.seal` + `writable: false`



### [[GET]]  [[PUT]]

分别对应属性获取 属性设置的行为





### 存在性

```js
const Symbol1 = Symbol(1)

const foo = {
  name: 'foo',
  [Symbol1]: 'Symbol1',
  [Symbol(2)]: 'Symbol2',
}

Reflect.setPrototypeOf(foo, {
  fun: 'fun',
})

for (const key in foo) {
  key
  // name ,fun
}

console.log(Reflect.getOwnPropertyDescriptor(foo, Symbol1))
// {
//   value: 'Symbol1',
//   writable: true,
//   enumerable: true,
//   configurable: true
// }

console.log(Object.getOwnPropertyNames.call(foo, foo))
// ['name']
console.log(Object.getOwnPropertySymbols.call(foo, foo))
// [ Symbol(1), Symbol(2) ]


```



|                                    | Enumerable | Nonenumerable | Symbols keys | Inherited Enumerable | Inherited Nonenumerable | Inherited Symbols keys |
| :--------------------------------- | :--------- | :------------ | :----------- | :------------------- | :---------------------- | ---------------------- |
| `in`                               | true       | true          | true         | true                 | true                    | true                   |
| `for..in`                          | true       | false         | false        | true                 | false                   | false                  |
| `obj.hasOwnProperty`               | true       | true          | true         | false                | false                   | false                  |
| `obj.propertyIsEnumerable`         | true       | false         | true         | false                | false                   | false                  |
| `Object.keys`                      | true       | false         | false        | false                | false                   | false                  |
| `Object.getOwnPropertyNames`       | true       | true          | false        | false                | false                   | false                  |
| `Object.getOwnPropertyDescriptors` | true       | true          | true         | false                | false                   | false                  |
| `Reflect.ownKeys()`                | true       | true          | true         | false                | false                   | false                  |



1. [[Enumerable]] 它表示是否通过 for-in 循环返回属性，也可以理解为：是否可枚举。
2. 是否是自己的?(not inherited )
3. Symbol



### 迭代器

[Symbol.iterator] -> function -> 返回一个迭代器对象next



迭代器模式

{

​	value: xxx,

​	done: false

}

