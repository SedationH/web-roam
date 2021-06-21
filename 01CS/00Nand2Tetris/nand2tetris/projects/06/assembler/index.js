const fs = require('fs')
const path = require('path')
const {
  deleteIndentationAndComments,
  parser,
  handleLabels,
} = require('./parser')

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
log('after deleteIndentationAndComments', sourceCodeArrays)

sourceCodeArrays = handleLabels(sourceCodeArrays)
log('after handleLabels', sourceCodeArrays)

sourceCodeArrays = parser(sourceCodeArrays, true)
log('after parser', sourceCodeArrays)

const targetCode = sourceCodeArrays.join('\r\n')
log('targetCode\n' + targetCode)

fs.writeFileSync(targetPath, targetCode)
