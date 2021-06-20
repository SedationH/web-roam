const code = require('./code')

const { log } = console
function parser(sourceCodeArrays, isFirstPass) {
  const temp = []
  sourceCodeArrays.forEach(line => {
    if (isAInstruction(line)) {
      handleAInstruction(line, temp)
    } else {
      handleCInstruction(line, temp)
    }
  })
  return temp
}

function isAInstruction(instruction) {
  return instruction.startsWith('@')
}

function handleAInstruction(line, ansArray) {
  const sourceValue = line.substring(1)
  const binaryValue = Number(sourceValue).toString(2)
  // 补 0
  let ans = binaryValue
  while (ans.length !== 16) {
    ans = 0 + ans
  }
  ansArray.push(ans)
}

// 没有考虑每行指令间还有空格的情况
function handleCInstruction(line, ans) {
  const lineArray = line.split(/[=;]/)
  let dest = '000'
  let comp = undefined
  let jump = '000'
  if (lineArray.length === 1) {
    // 只有comp的情况
  } else if (lineArray.length === 2) {
    // dest = comp
    // or
    // comp ; jump
    if (line.includes('=')) {
      const [destSymbol, compSymbol] = lineArray
      dest = code.dSet[destSymbol]
      comp = code.cSet[compSymbol]
    } else {
      const [compSymbol, jumpSymbol] = lineArray
      comp = code.cSet[compSymbol]
      jump = code.jSet[jumpSymbol]
    }
  } else {
    // 三个都有
    const [destSymbol, compSymbol, jumpSymbol] = lineArray
    dest = code.dSet[destSymbol]
    comp = code.cSet[compSymbol]
    jump = code.jSet[jumpSymbol]
  }
  ans.push('111' + comp + dest + jump)
}

module.exports = parser
