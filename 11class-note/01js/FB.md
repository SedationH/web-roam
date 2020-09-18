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



[练习](./tryImplement)，尝试实现JS提供的常用高阶函数



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
  curried2(1)(2, 3),
  curried2(1)(2)(3)
)
```



### 总结

- 固定参数
- 灵活，函数颗粒度更小
- 多元函数->一元函数
- 通过函数组合产生更加强大的功能

