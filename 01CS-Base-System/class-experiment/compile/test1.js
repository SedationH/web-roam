const fs = require('fs')
const readStream = fs.createReadStream('input')
const writeStream = fs.createWriteStream('output')
const { Transform } = require('stream')

const wipeSpace = new Transform({
  transform: (chunk, encoding, cb) => {
    cb(
      null,
      chunk.toString().replace(/\s+/g, ' ')
    )
  }
})

const keyWords = ['begin', 'end', 'if', 'then', 'else', 'while', 'do']
const opWords = ['+', '-', '*', '/', ':=', '<', '>']
const delimiterWords = ['(', ')', '{', '}', '[', ']', ';']

const lexical = new Transform({
  transform: (chunk, encoding, cb) => {
    const source = chunk.toString()
    let dest = ''
    for (let i = 0; i < source.length;) {
      const char = source[i]
      if (char === ' ') {
        i++
        continue
      }
      if (/[a-zA-Z]/.test(char)) {
        // 处理开头是字母的情况

        // 寻找下一个不符合标识符或者关键字要求临界位置
        const opsitePosition = source.slice(i).search(/\W/)
        const criticalPosition = opsitePosition === -1 ? source.length : i + opsitePosition
        const word = source.slice(i, criticalPosition)
        if (keyWords.includes(word)) {
          dest += `(${word}, 关键词)\n`
        } else {
          // TODO 标识符是否合法
          // 标识符的有效规则：以_ | 字母 开头，后面任意\w
          dest += `(${word}, 标识符)\n`
        }

        i = criticalPosition
      } else if (/\d/.test(char)) {
        // 处理开头是数字的情况
        const opsitePosition = source.slice(i).search(/\D/)
        const criticalPosition = opsitePosition === -1 ? source.length : i + opsitePosition
        const word = source.slice(i, criticalPosition)

        //TODO 数字是否合法
        dest += `(${word}, 数字)\n`

        i = criticalPosition
      } else {
        const opsitePosition = source.slice(i).search(/(\w|\s)/)
        const criticalPosition = opsitePosition === -1 ? source.length : i + opsitePosition
        const word = source.slice(i, criticalPosition)

        if (opWords.includes(word)) {
          dest += `(${word}, 操作符)\n`
        }

        if (delimiterWords.includes(word)) {
          dest += `(${word}, 界符)\n`
        }
        i = criticalPosition
      }
    }
    console.log(dest, source)
    cb(
      null,
      dest
    )
  }
})
``

readStream
  .pipe(wipeSpace)
  .pipe(lexical)
  .pipe(writeStream)