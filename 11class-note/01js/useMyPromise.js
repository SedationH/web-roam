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
  reject(1)
}).then(
  () => { },
  err => {
    console.log(err)
    return new MyPromise((_, reject) => {
      setTimeout(() => {
        reject(666)
      }, 2000);
    })
  }
).then(
  () => { },
  console.log
)