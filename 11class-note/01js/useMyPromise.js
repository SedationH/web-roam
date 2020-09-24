const MyPromise = require('./myPromise')

const promise = new MyPromise((resolve, reject) => {
  resolve(1)
})


const p = new Promise((resolve, reject) => {
  resolve(1)
})

const p2 = p.then(
  _ => p2
)
p2.catch(
  err => console.log(err)
)

// [TypeError: Chaining cycle detected for promise #<Promise>]