const { reject } = require('lodash')
const { compose } = require('lodash/fp')
const MyPromise = require('./myPromise')

new MyPromise((resolve, reject) => {
  resolve(1)
}).then().then().then(
  console.log
)

new MyPromise((_, reject) => {
  reject(2)
}).then().then().then(
  () => { },
  console.log
)