const
  PENDING = 'pending',
  FULFILLED = 'fulfilled',
  REJECTED = 'rejected'
class MyPromise {
  constructor(executor) {
    executor(this.resolve, this.reject)
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
    while (this.successCallbacks.length) this.successCallbacks.shift()(this.value)
  }

  reject = reason => {
    if (this.status !== PENDING) return
    this.status = REJECTED
    this.reason = reason
    while (this.failCallbacks.length) this.failCallbacks.shift()(this.reason)
  }

  then(onFulfilled, onRejected) {
    const returePromise = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        const result = onFulfilled(this.value)
        // 要判断result的类型和状态,决定如何处理
        resovlePromise(result, resolve, reject)
      } else if (this.status === REJECTED) {
        onRejected(this.reason)
      } else {
        this.successCallbacks.push(onFulfilled)
        this.failCallbacks.push(onRejected)
      }
    })
    return returePromise
  }

}

function resovlePromise(result, resolve, reject) {
  if (result instanceof MyPromise) {
    result.then(resolve, reject)
  } else {
    resolve(result)
  }
}

module.exports = MyPromise