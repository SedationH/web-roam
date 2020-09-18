// 简单实现，用于体会高阶函数

const forEach = (array, fn) => {
  for (const item of array) {
    fn(item)
  }
}
forEach([1, 2, 3], e => console.log(e))

const map = (array, fn) => {
  const results = []
  for (const item of array) {
    results.push(fn(item))
  }
  return results
}

console.log(map([1, 2, 3], e => e * e))

const filter = (array, fn) => {
  const results = []
  for (const item of array) {
    if (fn(item)) results.push(item)
  }
  return results
}

console.log(filter([-1, 1, 2], e => e > 0))

const every = (array, fn) => {
  let result = true
  for (const item of array) {
    if (!fn(item)) {
      result = false
      break
    }
  }
  return result
}

const some = (array, fn) => {
  let result = false
  for (const item of array) {
    if (fn(item)) {
      result = true
      break
    }
  }
  return result
}

console.log(
  every([1, 2, 3], e => e > 1),
  some([1, 2, 3], e => e > 1)
)