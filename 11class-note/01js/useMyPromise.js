const MyPromise = require('./myPromise')

const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('success')
  }, 0)
}).then(
  value => console.log(value),
  reason => console.log(reason)
)