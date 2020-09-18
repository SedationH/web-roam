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

