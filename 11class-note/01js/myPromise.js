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
  resolve = value => {
    this.status = FULFILLED
    this.value = value
    console.dir(this)
  }

  reject() {
    this.status = REJECTED
    console.log(this)
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