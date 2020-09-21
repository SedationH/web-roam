const fp = require('lodash/fp')

class IO {
  static of(x) {
    return new IO(function () {
      return x
    })
  }

  constructor(fn) {
    this._value = fn
  }

  map(fn) {
    return new IO(fp.flowRight(fn, this._value))
  }
}

const io = IO.of(process).map(p => p.execPath)

console.log(io._value())