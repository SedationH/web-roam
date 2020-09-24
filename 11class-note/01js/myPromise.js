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

  // 注意使用箭头函数，调用的函数是直接使用resolve的，需要绑定当前实例的this
  // 否则拿到的this可能是window | undefined(stric)
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