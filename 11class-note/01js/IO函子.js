const fp = require('lodash/fp')

// 为了解决IO操作所带来的副作用，引入IO函子
// 惰性处理IO的操作，整个函数保持纯，副作用由调用者处理
class IO {
  // 通过of我们可以感受到，通过IO函子，我们想拿到的还是值
  // 但是我们通过在值外面包裹一个函数，延迟拿到值
  static of(x) {
    return new IO(function () {
      return x
    })
  }

  // 接受一个函数
  // 通常IO把不纯的动作存储到_value中，延迟执行这个不纯的操作
  // 将不纯的操作交给调用着处理
  // io._value()
  constructor(fn) {
    this._value = fn
  }

  map(fn) {
    return new IO(fp.flowRight(fn, this._value))
  }
}

const io = IO.of(process).map(p => p.execPath)

console.log(io._value())