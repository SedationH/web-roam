const fs = require('fs')
const path = require('path')
const parser = require('./parser')

// use:
//  node assembler ./add/Add.asm
const { log } = console

const asmInputPath = process.argv[2]
const asmPath = path.resolve(asmInputPath)
const targetPath = asmPath.replace(/\.asm$/, '.hack')
console.log()

const sourceCode = fs.readFileSync(asmPath, 'utf8')
let sourceCodeArrays = sourceCode.split('\r\n')

sourceCodeArrays = deleteIndentationAndComments(sourceCodeArrays)
log(sourceCodeArrays)
sourceCodeArrays = parser(sourceCodeArrays, true)
log(sourceCodeArrays)
const targetCode = sourceCodeArrays.join('\r\n')
log(targetCode)

fs.writeFileSync(targetPath, targetCode)

// 删除其中的所有注释 空行
function deleteIndentationAndComments(sourceCodeArrays) {
  const commentsRegex = /\/\/.+/
  let temp = []
  sourceCodeArrays.forEach(line => {
    line = line.replace(commentsRegex, '').trim()
    if (line) temp.push(line)
  })
  return temp
}
