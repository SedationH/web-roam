// target: Hello World -> hello_world

const word = 'Hello World'

// 非 Point free
/**
 * @param {string} word
 */
function f1(word) {
  return word.toLowerCase().replace(/\s+/g, '_')
}

console.log(
  f1(word)
)

// Point Free
const fp = require('lodash/fp')
const f2 = fp.flowRight(fp.replace(/\s+/g, '_'), fp.toLower)

console.log(
  f2(word)
)

// 其实就是上面一直在用的