const MyPromise = require('./myPromise')

const promise = new MyPromise((resolve, reject) => {
  resolve(1)
}).then(
  value => {
    console.log(value)
    return new MyPromise(resolve => resolve(66))
  }
).then(
  console.log
)