// const grammar = {
//   1: "E -> TX",
//   2: "X -> +TX",
//   3: "X -> ε",
//   4: "T -> FY",
//   5: "Y -> *FY",
//   6: "Y -> ε",
//   7: "F -> (E)",
//   8: "F -> a",
// }

const grammar = {
  1: "X -> YZ",
  2: "Y -> ε",
  3: "Y -> a",
  4: "Z -> b",
  5: "Z -> ε",
}

const EPSILON = "ε"
const firstSets = {}

const text = "a+a*a+a"

startUp(grammar, text)

function startUp(grammar, text) {
  printGrammar(grammar)
  buildFirstSets(grammar)
  printSet("First sets", firstSets)
}

function printGrammar(grammar) {
  console.log("Grammar:\n")
  for (const k in grammar) {
    console.log("  ", grammar[k])
  }
  console.log("")
}

function buildFirstSets(grammar) {
  buildSet(firstOf)
}

// 对grammar每个句子的首字母执行builder
function buildSet(builder) {
  for (const k in grammar) {
    builder(grammar[k][0])
  }
}

function firstOf(symbol) {
  // 如果已经拿到做了这个symbol的first集，就不用再找了
  if (firstSets[symbol]) {
    return firstSets[symbol]
  }

  const first = (firstSets[symbol] = {})

  if (isTerminal(symbol)) {
    first[symbol] = true
    return firstSets[symbol]
  }

  // 获取关于这个symbol的所有产生式
  const productionsForSymbol = getProductionsForSymbol(
    symbol
  )
  for (let k in productionsForSymbol) {
    // 拿到产生式的右部
    const production = getRHS(productionsForSymbol[k])

    // 对产生式的右部进行分析，考虑EPSILON带来的影响
    // 若有X->BCD,则将First（B）所有元素（除了空串）加入First（A），
    // 然后检测First（B），若First（B）中不存在空串, 即ε,则停止，
    // 若存在则向B的后面查看，将First（C）中所有元素（除了空串）加入First（A），
    // 然后再检测First（C）中是否有ε...直到最后，若D之前的所有非终结符的First集中都含有ε,
    // 则检测到D时，
    // 将First（D）也加入First（A），若First（D）中含有ε,则将εe加入First（A）。
    const firstOfNonTerminalArr = []
    let flag = false
    for (let i = 0; i < production.length; i++) {
      const productionSymbol = production[i]

      // 递归拿到这个symbol的first集合
      let firstOfNonTerminal = firstOf(productionSymbol)

      // 两种情况 有空串和没空串
      // 第一个就 没空串 直接跳出
      if (!firstOfNonTerminal[EPSILON] && i == 0) {
        merge(first, firstOfNonTerminal)
        break
      }
      // 有空串 需要接着往下面找 需要根据最后一个来判断
      // 没有空串的firstOfNonTerminal来判断如何处理空串
      firstOfNonTerminalArr.push(firstOfNonTerminal)
    }
    const len = firstOfNonTerminalArr.length
    len && firstOfNonTerminalArr[len - 1][EPSILON] === true
      ? firstOfNonTerminalArr.forEach(
          (firstOfNonTerminal) =>
            merge(first, firstOfNonTerminal)
        )
      : firstOfNonTerminalArr.forEach(
          (firstOfNonTerminal) =>
            merge(first, firstOfNonTerminal, [EPSILON])
        )
  }
  return first
}

// 暂时规定不是大写的都是终结符
function isTerminal(symbol) {
  return !/[A-Z]/.test(symbol)
}

function getProductionsForSymbol(symbol) {
  const productionsForSymbol = {}
  for (const k in grammar) {
    if (grammar[k][0] === symbol) {
      productionsForSymbol[k] = grammar[k]
    }
  }
  return productionsForSymbol
}

function getRHS(production) {
  return production.split("->")[1].replace(/\s+/g, "")
}

function merge(to, from, exclude = []) {
  for (const k in from) {
    if (exclude.indexOf(k) === -1) {
      to[k] = from[k]
    }
  }
}

function printSet(name, set) {
  console.log(name + ": \n")
  for (const k in set) {
    console.log("  ", k, ":", Object.keys(set[k]))
  }
  console.log("")
}
