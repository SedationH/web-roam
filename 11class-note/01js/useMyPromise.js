const MyPromise = require('./myPromise')

const p = new MyPromise((resolve, reject) => {
  throw new Error('err')
})

// 拿到执行器的错误
p.then(
  () => { },
  console.log
)

const p2 = new MyPromise((resolve, reject) => {
  resolve(1)
}).then(
  value => {
    throw new Error('fulfilled里面的回调')
  }
).then(
  () => { },
  err => {
    console.log(err)
    console.log(111)
  }
)