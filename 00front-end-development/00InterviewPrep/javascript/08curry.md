## 闭包相关 思考once实现

不使用全局变量

通过返回的函数引入闭包环境中的标识信息

```js
const once = function (fn) {
  let flag = false

  return (...args) => {
    if (!flag) {
      flag = true
      fn(...args)
    }
  }
}

const pay = once(money => {
  console.log(`支付${money}成功✅`)
})

pay(1)
pay(2)

```



## 纯函数

A **pure function** is a function which:

- Given the same inputs, always returns the same output, and
- Has no side-effects

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



## curry

固定一部分参数

作用

1. 参数复用
2. 提前返回
3. 延迟执行



## add实现

```js
const curry = (fn, ...args) =>
  args.length >= fn.length
    ? fn(...args)
    : (..._args) => curry(fn, ...args, ..._args)

function add(a, b, c) {
  return a + b + c
}

const curriedAdd = curry(add)

console.log(
  curriedAdd(1)(2)(3),
  curriedAdd(1, 2)(3),
  curriedAdd(1)(2, 3),
  curriedAdd(1, 2, 3)
)

```

