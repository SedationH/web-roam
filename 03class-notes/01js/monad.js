const fs = require('fs')
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

const readFile = function (filename) {
  return new IO(function () {
    return fs.readFileSync(filename, 'utf-8')
  })
}

const writeFile = function (x) {
  return new IO(function () {
    // fs.writeFileSync('writeFile.md')
    console.log(x)
    return x
  })
}

const cat = fp.flowRight(writeFile, readFile)

const r = cat('package.json')._value()._value()

console.log(readFile('package.json')._value())

// console.log(r)