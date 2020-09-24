const MyPromise = require('./myPromise')

const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 0)
})

promise.then(
  console.log
)

promise.then(
  console.log
)