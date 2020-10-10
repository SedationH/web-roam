## Function Programming (FP) 

> FP是编程范式之一，除此之外，还有面向过程和面向对象

FP的思维方式：抽象数据处理过程，建立映射关系

函数式编程中函数是指映射关系

reference **[Master the JavaScript Interview: What is Functional Programming?](https://medium.com/javascript-scene/master-the-javascript-interview-what-is-functional-programming-7f218c68b3a0)**



## 前置知识

- 函数是一等公民
- 高阶函数
- 闭包

### 函数是一等公民

reference [MDN ](https://developer.mozilla.org/en-US/docs/Glossary/First-class_Function) [函数是一等公民](https://www.cnblogs.com/fundebug/p/javascript-first-class-function.html)

> A programming language is said to have **First-class functions** when functions in that language are treated like any other variable.

指函数可以

1. 赋值给变量
2. 作为函数参数
3. 作为函数返回值



- 把函数赋值给变量

```js
const fn = function() {console.log('hi')}

// 优化函数调用
const fnController = {
  index(posts) {return View.index(posts)},
  show(posts) {return View.show(posts)}
}
const fnController = {
  index: View.index(posts),
  show: View.show(posts)
}

```



### Higher-order function (高阶函数)

#### 特点

- 函数作为参数传递给另一个函数
- 函数作为另一个函数的返回结果

#### 举例

```js
// 函数作为参数
let new_array = arr.map(function callback( currentValue[, index[, array]]) {
    // return element for new_array
}[, thisArg])

// 函数作为返回值
function once(fn) {
  let done = false
  return function (...args) {
    if (!done) {
      done = true
      return fn.apply(this, args)
    }
  }
}

const pay = once(function (money) {
  console.log(`支付${money}成功✅`)
})

pay(1)
pay(2)

/**
 * 支付1成功✅
 */
```

#### 意义

- 屏蔽细节，关注目标
- 抽象通用问题



[练习](../tryImplement)，尝试实现JS提供的常用高阶函数



### 闭包

比较熟悉，不赘述

闭包的本质：函数执行完后出栈，堆上的作用域成员因为外部不能被释放，内部函数(通常为被返回的函数)仍然可以访问已经出栈的函数的成员变量

```js
// 场景：base通常固定，exponent是是变的
function makePower(exponent){
  return function(base){
    return Math.pow(base,exponent)
  }
}
```



## 纯函数

A **pure function** is a function which:

- Given the same inputs, always returns the same output, and
- Has no side-effects



### 好处

- 可缓存

```js
// 因为纯函数什么样的输入就可以得到什么样子的输出
// 我们可以通过建立input -> output的映射缓存
function memoize(f) {
  const cache = {}
  return function (...args) {
    const arg_str = JSON.stringify(args)
    cache[arg_str] = cache[arg_str] || f.apply(f, args)
    return cache[arg_str]
  }
}

function getArea(r) {
  console.log('getArea调用')
  return Math.PI * r * r
}

const fn = memoize(getArea)

console.log(fn(1))
console.log(fn(1))
console.log(fn(1))

// getArea调用
// 3.141592653589793
// 3.141592653589793
// 3.141592653589793
```

- 方便测试 输入输出的稳定关联
- 并行处理
  - 在多线程环境下并行操作共享的数据很可能会出现意外情况
  - 纯函数不需要访问共享的内存数据，所以在并行环境下可以任意运行纯函数(Web Worker[JS也能多线程了])

### 副作用

```js
const mini = 18
function checkAge(age) {
  return age >= mini
}

// refer mini not pure
```

如果函数依赖于外部的状态就无法保证相同的输入一定会带来相同的输出

来源：

- 配置文件
- 数据库
- 用户交互

> 所有的外部交互都可能带来副作用，副作用也使得方法通用性下降，带来不稳定
>
> 但副作用不可能完全禁止，尽可能控制他们在可控范围内发生



## 柯里化(currying)

固定一部分参数，相当于对于函数参数的缓存

```js
const _ = require('lodash')

function getSum(a, b, c) {
  return a + b + c
}

const curried = _.curry(getSum)

console.log(
  curried(1, 2, 3),
  curried(1)(2, 3),
  curried(1)(2)(3)
)
// 6 6 6

const match = _.curry((reg, str) => str.match(reg))
const haveSpace = match(/\s+/g)
const haveNumber = match(/\d+/g)

console.log(haveSpace('hi i am you love❤️'))

const filter = _.curry((fn, arry) => arry.filter(fn))

console.log(filter(haveSpace, ['hi SedationH', 'hi_SedationT']))

// 进行组合
const SelectItemHaveSpace = filter(haveSpace)
console.log(
  SelectItemHaveSpace(['hi SedationH', 'hi_SedationT'])
)

```



### lodash中的currying

```js
const _ = require('lodash')

function getSum(a, b, c) {
  return a + b + c
}

const curried = _.curry(getSum)

console.log(
  curried(1, 2, 3),
  curried(1)(2, 3),
  curried(1)(2)(3)
)
// 6 6 6

const match = _.curry((reg, str) => str.match(reg))
const haveSpace = match(/\s+/g)
const haveNumber = match(/\d+/g)

console.log(haveSpace('hi i am you love❤️'))

const filter = _.curry((fn, arry) => arry.filter(fn))

console.log(filter(haveSpace, ['hi SedationH', 'hi_SedationT']))

// 进行组合
const SelectItemHaveSpace = filter(haveSpace)
console.log(
  SelectItemHaveSpace(['hi SedationH', 'hi_SedationT'])
)


// 简单实现_.curry
// 有点小难

// 分析
/**
 * curry能返回一个函数
 * 当函数的参数不够时，返回固定部分参数的函数
 * 返回直接能够运行的函数
 */
function curry(fn) {
  return function curriedFn(...args) {
    // 根据实参和形参的关系
    if (args.length < fn.length) {
      return function () {
        return curriedFn(...args.concat(Array.from(arguments)))
      }
    }
    return fn(...args)
  }
}

function getSum(a, b, c) {
  return a + b + c
}

const curried2 = curry(getSum)


console.log(
  curried2(1, 2, 3),
  curried2(1)(2, 3), // 举例 看下面
  curried2(1)(2)(3)
)
```



重点断点向curried2传入部分参数的时候函数的执行和返回情况

比如当curried2(1)返回后(2,3)执行返回的函数

![image-20200920162035882](http://picbed.sedationh.cn/image-20200920162035882.png)



下面一行  执行(1)(2)返回的函数

![](http://picbed.sedationh.cn/image-20200920162035882.png)

这一点还是有些绕的 注意断点理解

### 总结

- 固定参数
- 灵活，函数颗粒度更小
- 多元函数->一元函数
- 通过函数组合产生更加强大的功能



## 函数组合

### 场景

使用多个函数才能获取到所需要的结果的时候，代码比较丑（洋葱代码）

`_.toUpper(_.first(_.reverse(array)))`

### 意义

通过compose函数组合所需的函数，将多个函数组合成一个函数

> 形象化理解：
>
> ​	函数是处理的管道 上述场景就是说 数据需要通过多个管道
>
> ​	我们通过compose函数将他们封装称为一个大管道
>
> ![image-20200920171548378](http://picbed.sedationh.cn/image-20200920171548378.png)

### 实现

值得注意的是，如果函数执行的顺序是f1 -> f2 -> f3

我们一般写成 compose(f3, f2, f1)

[implementFlow.html](../implementFlow.html)

```js
function compose(...fns) {
  return function (value) {
    return fns.reverse().reduce(function (accValue, curFn) {
      return curFn(accValue)
    }, value)
  }
}

function curry(fn) {
  return function curriedFn(...args) {
    if (args.length < fn.length) {
      return function () {
        // 这里注意arguments是伪数组,需要转换一下
        return curriedFn(...args.concat(Array.from(arguments)))
      }
    }
    return fn(...args)
  }
}

// 目标
// transform NEVER SAY DIE to never-say-day

// 需要用到的函数
const toLowerCase = value => value.toLowerCase()
const split = curry((sep, str) => str.split(sep))
const join = curry((sep, str) => str.join(sep))
const log = value => {
  console.log(value)
  return value
}
const track = curry((tag, value) => {
  console.log(`${tag}: ${value}`)
  return value
})


const f = compose(join('-'), track('after split'), split(' '), log, toLowerCase)

console.log(
  f('NEVER SAY DIE')
)
```



## Pointfree

Point free 是一种编程风格，指将函数处理数据的过程定义为与数据无关的合成运算

这里需要两个前提知识

1. 柯里化
2. 函数组合

我们通过上面两个方法来具体实现



为了操作方便，引入Lodash fp模块来演示

```js
// target: Hello World -> hello_world

const word = 'Hello World'

// 非 Point free
/**
 * @param {string} word
 */
function f1(word) {
  return word.toLowerCase().replace(/\s+/g, '_')
}

console.log(
  f1(word)
)

// Point Free
const fp = require('lodash/fp')
const f2 = fp.flowRight(fp.replace(/\s+/g, '_'), fp.toLower)

console.log(
  f2(word)
)

// 其实就是上面一直在用的
```



## Functor(函子)

在函数式编程中，为了控制副作用(异常，异步)在可控的范围内，引入了函子

所谓函子，就是一个容器，包含值和值的变形关系(map函数)

```js
class Container {
  // 省略通过new来创建对象 更加函数式
  static of(value) {
    return new Container(value)
  }

  constructor(value) {
    this._value = value
  }

  // map利用fn处理变形关系，产生新的Container
  map(fn) {
    return Container.of(fn(this._value))
  }
}

const r = Container.of(3)
  .map(x => x + 2)
  .map(x => x * x)

console.log(r)

// 由此可见，函数式编程的运算不直接操作值，而是借助函子完成
// 所谓函子就是一个实现了map，存有值的对象

```

### MayBe

```js
// 为了解决空值异常，引入Mabe函子
class MayBe {
  static of(value) {
    return new MayBe(value)
  }

  constructor(value) {
    this._value = value
  }

  map(fn) {
    // 实际上就是在fn执行前增加了一个空值处理
    return this.isNothing() ? MayBe.of(this._value)
      : MayBe.of(fn(this._value))
  }

  isNothing() {
    return this._value === null || this._value === undefined
  }
}

const r2 = MayBe.of(null)
  .map(x => x.toLowerCase())

console.log(r2)

```

### Either函子

```js
// 为了解决异常造成的副作用，引入Either函子

// 产生异常的情况
class Left {
  static of(value) {
    return new Left(value)
  }

  constructor(value) {
    this._value = value
  }

  // 这里让map直接返回当前函子
  map() {
    return this
  }
}

// 正常处理的情况
class Right {
  static of(value) {
    return new Right(value)
  }

  constructor(value) {
    this._value = value
  }

  map(fn) {
    return Right.of(fn(this._value))
  }
}

function parseJSON(json) {
  try {
    return Right.of(JSON.parse(json))
  } catch (e) {
    return Left.of({ message: 'error' })
  }
}

console.log(
  parseJSON('{ "name": "zs" }').map(x => x.name.toUpperCase()),
  parseJSON('{ name: "zs" }').map(x => x.name.toUpperCase())
)
```

### IO函子

```js
const fp = require('lodash/fp')

// 为了解决IO操作所带来的副作用，引入IO函子
// 惰性处理IO的操作，整个函数保持纯，副作用由调用者处理
class IO {
  // 通过of我们可以感受到，通过IO函子，我们想拿到的还是值
  // 但是我们通过在值外面包裹一个函数，延迟拿到值
  static of(x) {
    return new IO(function () {
      return x
    })
  }

  // 接受一个函数
  // 通常IO把不纯的动作存储到_value中，延迟执行这个不纯的操作
  // 将不纯的操作交给调用着处理
  // io._value()
  constructor(fn) {
    this._value = fn
  }

  map(fn) {
    return new IO(fp.flowRight(fn, this._value))
  }
}

const io = IO.of(process).map(p => p.execPath)

console.log(io._value())
```

注意IO函子在设计上与上面其他函子的区别，首先_value是个函数，用来惰性处理IO操作，最终想拿到的仍然是IO后的值，不过我们用一个函数把这个值包裹了起来

### Task函子

task函子用于处理异步任务，这里简单实用folktale来实现需求

```js
const fs = require('fs')
const { task } = require('folktale/concurrency/task')
const { find, split, flowRight } = require('lodash/fp')

function readFile(filename) {
  return task(resolver => {
    fs.readFile(filename, 'utf-8', (err, data) => {
      if (err) resolver.reject(err)
      resolver.resolve(data)
    })
  })
}

// 这里的run 有_.value()的感觉
readFile('package.json')
  // .map(split('\n'))
  // .map(find(line => line.includes('version')))
  .map(
    flowRight(
      find(line => line.includes('version')),
      split('\n')
    )
  )
  .run()
  .listen({
    onRejected: err => console.log(err),
    onResolved: value => console.log(value)
  })

```

### Pointed函子

指实现了of静态方法的函子

上面提过说of是为了不实用new，让代码看起来更像是函数式编程

但更深层的含义是of方法用来把值放到上下文Context中，即容器将值包裹起来，放到map可以进行处理的上下文之中

### Monad 单子

没看懂....