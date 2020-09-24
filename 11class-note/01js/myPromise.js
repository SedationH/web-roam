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
    if (this.status === FULFILLED) {
      onFulfilled(this.value)
    } else if (this.status === REJECTED) {
      onRejected(this.reason)
    } else {
      this.successCallbacks.push(onFulfilled)
      this.failCallbacks.push(onRejected)
    }
  }
}

module.exports = MyPromise