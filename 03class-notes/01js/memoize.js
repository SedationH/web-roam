// 因为纯函数什么样的输入就可以得到什么样子的输出
// 我们可以通过建立input -> output的映射缓存
// 第一次写的时候出了个bug 如果f不返回值 那么是不能缓存的
// 但在函数式编程中，一般都有返回值(输出)
function memoize(f) {
  const cache = {}
  return function (...args) {
    const arg_str = JSON.stringify(args)
    cache[arg_str] = cache[arg_str] || f.apply(f, args)
    return cache[arg_str]
  }
}

function getArea(r) {
  console.log('getArea调用')
  return Math.PI * r * r
}

const fn = memoize(getArea)

console.log(fn(1))
console.log(fn(1))
console.log(fn(1))

// getArea调用
// 3.141592653589793
// 3.141592653589793
// 3.141592653589793