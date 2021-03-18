实现流程



## 同步逻辑，状态不可变

```js
new MyPromise((resolve, reject) => {
  resolve('s')
  reject('f')
}).then(console.log, console.log)
```



```js
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  status = PENDING
  value = undefined
  reason = undefined

  constructor(executor) {
    executor(this.resolve, this.reject)
  }

  resolve = value => {
    if (this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
  }

  reject = reason => {
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
  }

  then(onFulfilled, onRejected) {
    if (this.status === FULFILLED) {
      onFulfilled(this.value)
    } else if (this.status === REJECTED) {
      onRejected(this.reason)
    }
  }
}

module.exports = MyPromise
```



## 加入对于异步的处理

```js
const MyPromise = require('./MyPromise')

new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('s')
    reject('f')
  }, 200)
}).then(value => console.log(value))
```



```js
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  status = PENDING
  value = undefined
  reason = undefined
+  successCallback = undefined
+  failCallback = undefined

  constructor(executor) {
    executor(this.resolve, this.reject)
  }

  resolve = value => {
    if (this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
+    this.successCallback && this.successCallback(this.value)
  }

  reject = reason => {
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
+    this.failCallback && this.failCallback(this.reason)
  }

  then(successCallback, failCallback) {
    if (this.status === FULFILLED) {
      successCallback(this.value)
    } else if (this.status === REJECTED) {
      failCallback(this.reason)
    } else {
+      // wait 暂存
+      this.successCallback = successCallback
+      this.failCallback = failCallback
    }
  }
}

module.exports = MyPromise
```



## 对于一个Pormise实例多次调用

```js
successCallback = []
failCallback = []

resolve = value => {
  if (this.status !== PENDING) return
  this.status = FULFILLED
  this.value = value
  while (this.successCallback.length) {
    this.successCallback.shift()(this.value)
  }
}

then() {
  ...
  } else {
    // wait 暂存
    this.successCallback.push(successCallback)
    this.failCallback.push(failCallback)
  }
```



## then 链式调用

> A promise must provide a `then` method to access its current or eventual value or reason.

then 返回的是一个Promise实例，实例上存在 then 方法，就可以实现链式调用了

此时的实现无法满足异步需求，必须then的时候状态已经不是pending状态了

```js
then(successCallback, failCallback) {
+  return new MyPromise((resolve, reject) => {
    if (this.status === FULFILLED) {
+      const ret = successCallback(this.value)
+      resovlePromise(ret, resolve, reject)
    } else if (this.status === REJECTED) {
      failCallback(this.reason)
    } else {
      // wait 暂存
      this.successCallback.push(successCallback)
      this.failCallback.push(failCallback)
    }
  })
}
```



```js
// 需要对then方法中返回的值进行处理
// 普通值直接resolve 实例值通过then来拿到之后的值
function resovlePromise(ret, resolve, reject) {
  if (ret instanceof MyPromise) {
    ret.then(resolve, reject)
  } else {
    resolve(ret)
  }
}
```

**这里是理解的难点**

```js
p1.then(value => {
  console.log(value)
  return createPromise()
}).then(value => console.log(value))

function createPromise() {
  return new MyPromise((resolve, reject) => {
    resolve(99)
  })
}

```

区别then 返回的Promise & 我们在第一个then中返回的createPromise()，两者是不一样的Promise实例

ret 拿到的是createPromise()创建的实例(ins1)

我们需要根据ins1的状态来指导then中返回的Promise状态

想拿到ins1的状态，通过then去拿，在拿到ins1的状态之中，调用then返回的Promise中的 resolve || reject



## 处理then的一些问题

### 自我调用问题

```js
const p1 = new Promise((resolve, reject) => {
  resolve('s')
})

const p2 = p1.then(value => {
  console.log(value)
  return p2
})

p2.then(
  () => {},
  reason => {
    console.log(reason)
  }
)
// TypeError: Chaining cycle detected for promise #<Promise>
```

处理方式，拿到then将要访问的Promise与then函数中准备返回的Promise进行比对

这里逻辑好绕

看着也容易迷惑

学到了通过利用EventLoop延迟拿到数据的方式，这里很奇怪

```js
a = b + c
// b又需要a，不过是通过new的方式，感觉还是怪怪的
```

```js
then(successCallback, failCallback) {
  const thenReturnPromise = new MyPromise(
    (resolve, reject) => {
      if (this.status === FULFILLED) {
        // 这里比对thenReturnPromise & ret是不是一个值
        // 但是处于 thenReturnPromise 的创建过程，无法使用
        // 利用EventLoop在下一个Macro Task中进行处理
        setTimeout(() => {
          const ret = successCallback(this.value)
          resovlePromise(
            thenReturnPromise,
            ret,
            resolve,
            reject
          )
        }, 0)
      } else if (this.status === REJECTED) {
        failCallback(this.reason)
      } else {
        // wait 暂存
        this.successCallback.push(successCallback)
        this.failCallback.push(failCallback)
      }
    }
  )

  return thenReturnPromise
}
```

### 一些异常处理

```js
then(onFulfilled, onRejected) {
  onFulfilled = onFulfilled ? onFulfilled : value => value
  onRejected = onRejected ? onRejected : reason => { throw reason }
  const returePromise = new MyPromise((resolve, reject) => {
    // 多次把任务放到宏队列，进行抽象
    const handleSetTimeout = (callback) => {
      setTimeout(() => {
        // 捕获成功回调里面可能的异常
        try {
          const result = callback(this.value)
          // 要判断result的类型和状态,决定如何处理
          resovlePromise(returePromise, result, resolve, reject)
        } catch (e) {
          reject(e)
        }
      }, 0);
    }

    if (this.status === FULFILLED) {
      handleSetTimeout(onFulfilled)
    } else if (this.status === REJECTED) {
      handleSetTimeout(onRejected)
    } else {
      this.successCallbacks.push(() => {
        handleSetTimeout(onFulfilled)
      })
      this.failCallbacks.push(() => {
        handleSetTimeout(onRejected)
      })
    }
  })
  return returePromise
}
```



## 完整版本

```js
const
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected'
class MyPromise {
  constructor(executor) {
    try {
      executor(this.resolve, this.reject)
    } catch (e) {
      this.reject('executor err', e)
    }
  }
  status = PENDING
  value = undefined
  reason = undefined
  successCallbacks = []
  failCallbacks = []

  // 注意使用箭头函数，调用的函数是直接使用resolve的，需要绑定当前实例的this
  // 否则拿到的this可能是window | undefined(stric)
  resolve = value => {
    if (this.status !== PENDING) return
    this.status = FULFILLED
    this.value = value
    while (this.successCallbacks.length) this.successCallbacks.shift()()
  }

  reject = reason => {
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    while (this.failCallbacks.length) this.failCallbacks.shift()()
  }

  then(onFulfilled, onRejected) {
    onFulfilled = onFulfilled ? onFulfilled : value => value
    onRejected = onRejected ? onRejected : reason => { throw reason }
    const returePromise = new MyPromise((resolve, reject) => {
      // 多次把任务放到宏队列，进行抽象
      const handleSetTimeout = (callback) => {
        setTimeout(() => {
          // 捕获成功回调里面可能的异常
          try {
            const result = callback(this.value)
            // 要判断result的类型和状态,决定如何处理
            resovlePromise(returePromise, result, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0);
      }

      if (this.status === FULFILLED) {
        handleSetTimeout(onFulfilled)
      } else if (this.status === REJECTED) {
        handleSetTimeout(onRejected)
      } else {
        this.successCallbacks.push(() => {
          handleSetTimeout(onFulfilled)
        })
        this.failCallbacks.push(() => {
          handleSetTimeout(onRejected)
        })
      }
    })
    return returePromise
  }

  finally(callback) {
    return this.then(
      value => (
        MyPromise.resolve(callback()).then(
          () => value
        )
      ),
      reason => (
        MyPromise.resolve(callback()).then(
          () => { throw reason },
        )
      )
    )
  }

  catch(onRejected) {
    return this.then(
      undefined,
      onRejected
    )
  }

  static all(array) {
    const result = [], len = array.length
    let cnt = 0
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < len; i++) {
        if (array[i] instanceof MyPromise) {
          array[i].then(
            value => {
              result[i] = value
              cnt++
              if (cnt === len) resolve(result)
            },
            reason => reject(reason)
          )
        } else {
          result[i] = array[i]
          cnt++
        }
      }
    })
  }

  static resolve(value) {
    return value instanceof MyPromise ? value :
      new MyPromise(resolve => resolve(value))
  }
}

function resovlePromise(returePromise, result, resolve, reject) {
  if (returePromise === result) {
    // 这里的return只是意味着终止
    return reject(TypeError('[TypeError: Chaining cycle detected for promise #<Promise>]'))
  }
  if (result instanceof MyPromise) {
    result.then(resolve, reject)
  } else {
    resolve(result)
  }
}  
```





