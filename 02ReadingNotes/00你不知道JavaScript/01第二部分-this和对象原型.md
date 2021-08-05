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



理清原型链后的另一种写法

```js
function myInstanceOf(instance, constructor) {
  return Object.prototype.isPrototypeOf.call(
    constructor.prototype,
    instance
  )
}
```

isPrototypeOf 和 instaceof都是查原型链上

注意不包含自身，自己不是所查的原型

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



## mixin

(这一章读的有些费劲，已经比较习惯了 原型的方式)



### 面向类的设计模式

实例化 instantiation

继承 inheritance

（相对）多态  polymorphism



面向对象编程强调包装数据与数据相关的操作

继承是从父类中**复制**代码

相对多态允许子类重写父类代码（重写的含义是建立在复制行为上的），相对性允许通过类似super的方式拿到基础类

> 传统面向对象语言中，构造函数是属于类的
>
> 在JavaScript这里恰好相反，类是属于构造函数的(Foo.prototype)，子类和父类并没有直接的关系
>
> ES6引入了super来解决这个问题

> 多态并不表示子类和父类有关联，子类得到的只是 父类的一份副本。类的继承其实就是复制

![image-20210723142915527](http://picbed.sedationh.cn/image-20210723142915527.png)

### 编程范式

函数式编程

面向对象编程



JS都可以实践他们，从这个角度来看，类是一种可选的代码抽象，设计模式



Java中全是类，并不可选



### mixin

想起 <<JavaScript核心原理解析>> 中提到的，开发者总想着把自己过去的经验复用过来，mixin搞得就是这个感觉

传统面向对象语言继承是真的在复制，于是开发者使用mixin来完成这样的需求



## 原型

### 屏蔽

屏蔽就是说找某个属性的时候，链式查询，近的有了就用了，相当于原项链的上层被屏蔽了。



```js
'use strict'
// 严格模式下对 writable 的属性赋值会 false

const { log } = console

const fooPrototype = {}

Object.defineProperty(fooPrototype, 'name', {
  writable: false,
  value: 'foo proto ',
})

const foo = Object.create(fooPrototype)

foo.name = 'foo'

log(foo)
```



```js
'use strict'

const { log } = console

const fooPrototype = {}

Object.defineProperty(fooPrototype, 'name', {
  set: function () {
    this._name = 'foo'
  },
})

const foo = Object.create(fooPrototype)

foo.name = 'foo'

log(foo)

// _name: "foo"

// __proto__:

//   set name: ƒ ()

//   __proto__: *Object*
```



### 类

JavaScript实际上是更纯粹的面向对象

这里除了一些primitive value之外，只有对象，并不需要类来实例化对象

不需要类来描述对象的行为，对象直接定义自己的行为

传统中类实例化创建对象的方式是把类的行为复制到实例中去、JS这里是建立关联

继承意味着复制，这不适合描述JS引擎的行为，更合适的描述是创建关联 -> **委托**



创建一个Foo函数 会自动有一个 Foo.prototype

这个Foo.prototype 会 默认有一个 contructor -> Foo函数

注意一下这个contructor 的 PropertyDescriptor

```js
function foo() {}

console.log(
  Object.getOwnPropertyDescriptor(foo.prototype, 'constructor')
)
// {
//   configurable: true
//   enumerable: false
//   value: ƒ foo()
//   writable: true
// }
```





### 利用原型实现类似继承的效果

```js
function Bar() {}

function Foo() {}

Foo.prototype = Object.create(Bar.prototype)

const f = new Foo()

console.log(Foo.prototype.constructor) // Bar
console.log(f instanceof Foo) // true
```

不太好，搞丢了contructor



```js
function Bar() {}

function Foo() {}

Object.setPrototypeOf(Foo.prototype, Bar.prototype)

const f = new Foo()

console.log(Foo.prototype.constructor) // Foo
console.log(f instanceof Foo) // true
```

比较和谐的方案



尽管从效果上来看setPrototypeOf优于create(影响了constructor)

但浏览器实现起来不容易，考虑性能的话还是使用 create

> Because this feature is a part of the language, it is still the burden on engine developers to implement that feature performantly (ideally). Until engine developers address this issue, if you are concerned about performance, you should avoid setting the `[[Prototype]]` of an object. Instead, create a new object with the desired `[[Prototype]]` using [`Object.create()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create).


### 原型链

原型链就是一系列[[ prototype ]]构成的链状关系

属性在C上找不到，利用C.[[prototype]]找到B，B上没有找B.[[prototype]] ...



## 行为委托



面向对象

```js
function Foo(who) {
  this.me = who
}

Foo.prototype.identify = function () {
  return 'I am' + this.me
}

function Bar(who) {
  Foo.call(this, who)
}

Reflect.setPrototypeOf(Bar.prototype, Foo.prototype)

Bar.prototype.speak = function () {
  console.log('hi' + this.identify())
}

const b1 = new Bar(1)
const b2 = new Bar(2)

b1.speak()
b2.speak()

console.log(b1 instanceof Foo) // true
```



对象关联

```js
const Foo = {
  init: function (who) {
    this.me = who
  },
  identify: function () {
    return `Hi i am. ${this.me}`
  },
}

const Bar = Object.create(Foo)

Object.assign(Bar, {
  speak() {
    console.log(this.identify())
  },
})

const b = Object.create(Bar)

b.init('SedationH')
b.speak()
```



类并不是唯一的代码组织方式，这里的行为委托可以用简洁的描述实现一样的功能



还把声明和初始化(init) 分离



但无奈的是，整个社区都在朝着类的方向努力着，让js更加像类

比如class语法，从实现上来看，只是 prototype 的语法糖

是种静态实现

