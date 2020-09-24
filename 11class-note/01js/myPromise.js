const
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected'
class MyPromise {
  constructor(executor) {
    try {
      executor(this.resolve, this.reject)
    } catch (e) {
      this.reject('executor err')
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
    const returePromise = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        // 这里引入异步，先产生returnPromise
        setTimeout(() => {
          // 捕获成功回调里面可能的异常
          try {
            const result = onFulfilled(this.value)
            // 要判断result的类型和状态,决定如何处理
            resovlePromise(returePromise, result, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0);
      } else if (this.status === REJECTED) {
        setTimeout(() => {
          // 捕获成功回调里面可能的异常
          try {
            const result = onRejected(this.reason)
            // 要判断result的类型和状态,决定如何处理
            resovlePromise(returePromise, result, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0);
      } else {
        this.successCallbacks.push(() => {
          setTimeout(() => {
            // 捕获成功回调里面可能的异常
            try {
              const result = onFulfilled(this.value)
              // 要判断result的类型和状态,决定如何处理
              resovlePromise(returePromise, result, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0);
        })
        this.failCallbacks.push(() => {
          setTimeout(() => {
            // 捕获成功回调里面可能的异常
            try {
              const result = onRejected(this.reason)
              // 要判断result的类型和状态,决定如何处理
              resovlePromise(returePromise, result, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0);
        })
      }
    })
    return returePromise
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

module.exports = MyPromise