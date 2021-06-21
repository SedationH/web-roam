const code = require('./code')
const { symbolsTable, get } = require('./symbols-table')

const { log } = console

// 删除其中的所有注释 空行
function deleteIndentationAndComments(sourceCodeArrays) {
  // 不知道为什么加了g就可用了
  const commentsRegex = /\/\/.*/g
  let temp = []
  sourceCodeArrays.forEach(line => {
    line = line.replace(commentsRegex, '').trim()
    if (line) temp.push(line)
  })
  return temp
}

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
  let sourceValue = line.substring(1)
  let numberType = Number(sourceValue)
  // 能否转化为数字
  if (Number.isNaN(numberType)) {
    numberType = get(sourceValue)
  }
  console.log(numberType)
  const binaryValue = numberType.toString(2)
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

function isLabels(instruction) {
  const labelRegexp = /\(.*\)/
  return labelRegexp.test(instruction)
}

function handleLabels(sourceCodeArrays) {
  // label 想要标记的含义是下一行在程序中的行数(index [0, ...])
  let lineCnt = 0
  const temp = []
  sourceCodeArrays.forEach(line => {
    if (isLabels(line)) {
      console.log('labels  ', line)
      const label = line.substring(1, line.length - 1)
      symbolsTable[label] = lineCnt
    } else {
      lineCnt++
      temp.push(line)
    }
  })

  console.log(symbolsTable)
  return temp
}

module.exports = {
  parser,
  handleLabels,
  deleteIndentationAndComments,
}
