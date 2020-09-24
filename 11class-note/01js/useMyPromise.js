const MyPromise = require('./myPromise')

const p1 = () => new MyPromise((resolve) => {
  setTimeout(resolve, 2000, 'p1')
})

const p2 = () => new MyPromise((resolve) => {
  setTimeout(resolve, 1000, 'p2')
})

MyPromise.all(
  ['a', 'b', p1(), p2(), 'c']
).then(
  console.log
)

// [ 'a', 'b', 'p1', 'p2', 'c' ]