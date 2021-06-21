// 进行一些初始化
// 预制 r1 -> r15 个寄存器，所以从16开始
const symbolsTable = {
  SP: 0,
  LCL: 1,
  ARG: 2,
  THIS: 3,
  THAT: 4,
  SCREEN: 16384,
  KBD: 24576,
}

// 配置 [R0 -> R15] 寄存器
let num = 16
while (num--) {
  symbolsTable[`R${num}`] = num
}

let nextPosition = 16

const get = key => {
  if (!(key in symbolsTable)) {
    symbolsTable[key] = nextPosition
    nextPosition++
  }
  return symbolsTable[key]
}

module.exports = { symbolsTable, get }
