const { reject } = require('lodash/fp')
const MyPromise = require('./myPromise')

const promise = new MyPromise((resolve, reject) => {
  resolve('success')
  reject('fail')
}).then(
  value => console.log(value),
  reason => console.log(reason)
)