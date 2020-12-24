const range = {
  from: 1,
  to: 5,
}

// 默认生成迭代器的工厂函数
range[Symbol.iterator] = function () {
  console.log('call once')
  // 返回一个迭代器
  return {
    current: this.from,
    last: this.to,
    next() {
      // IteratorResult
      return this.current <= this.last
        ? {
            done: false,
            value: this.current++,
          }
        : {
            done: true,
            value: undefined,
          }
    },
    return() {
      console.log('return invoke')
      return {
        done: true,
      }
    },
  }
}
const arr = Array.from(range)
console.log(arr)
// call once
// [ 1, 2, 3, 4, 5 ]
console.log(...range)
// call once
// 1 2 3 4 5