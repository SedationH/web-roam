const MyPromise = require('./myPromise')

const p = new MyPromise((resolve, reject) => {
  resolve(1)
})

const p2 = p.then(
  _ => p2
)
p2.then(
  () => { },
  err => console.log(err)
)

// [TypeError: Chaining cycle detected for promise #<Promise>]