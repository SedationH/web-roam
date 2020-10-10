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