const EPSILON = "ε"

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
  1: "X -> YZQ",
  2: "Y -> ε",
  3: "Y -> a",
  4: "Z -> b",
  5: "Z -> ε",
  6: `Q -> ${EPSILON}`,
}

const START_SYMBOL = "X"

const firstSets = {}
const followSets = {}

const text = "a+a*a+a"

startUp(grammar, text)

function startUp(grammar, text) {
  printGrammar(grammar)
  buildFirstSets(grammar)
  buildFollowSets(grammar)
  printSet("First sets", firstSets)
  printSet("Follow sets", followSets)
}

function buildFollowSets(grammar) {
  buildSet(followOf)
}

function followOf(symbol) {
  if (followSets[symbol]) {
    return followSets[symbol]
  }
  const follow = (followSets[symbol] = {})
  if (symbol === START_SYMBOL) {
    follow["$"] = true
  }

  const productionsWithSymbol = getProductionsWithSymbol(
    symbol
  )
  for (const k in productionsWithSymbol) {
    const production = productionsWithSymbol[k]
    const RHS = getRHS(production)
    // 几种可能出现的情况 默认都在求follow(B)
    //   1. A -> aB 那么要求follow(A)
    //   2. A -> aBC 求follow(C)
    //   如果非终结符号 C | A 的first集合中没有ε 则 follow(B) = first(A) | first(C)
    //   如果有ε 需要接着往下找
    //   A -> Bz 直接z  因为上面first对于非终结符号的处理也有，所以也和上面的操作一致了
    //   对于开始符号的处理进行了特定判断

    const symbolIndex = RHS.indexOf(symbol)
    let followIndex = symbolIndex + 1

    while (true) {
      if (followIndex === RHS.length) {
        // "$"
        //   1. A -> aB 那么要求follow(A)
        // 同时处理1. 的情况和扫面到结尾的情况
        const LHS = getLHS(production)
        if (LHS !== symbol) {
          // To avoid cases like: B -> aB awesome!!!!
          merge(follow, followOf(LHS))
        }
        break
      }

      const followSymbol = RHS[followIndex]

      const firstOfFollow = firstOf(followSymbol)

      if (!firstOfFollow[EPSILON]) {
        merge(follow, firstOfFollow)
        break
      }

      merge(follow, firstOfFollow, [EPSILON])
      followIndex++
    }
  }
  return follow
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
  for (const k in productionsForSymbol) {
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
    for (let i = 0; i < production.length; i++) {
      const productionSymbol = production[i]

      // 递归拿到这个symbol的first集合
      let firstOfNonTerminal = firstOf(productionSymbol)

      firstOfNonTerminalArr.push(firstOfNonTerminal)

      // 整体来看，遇到没有空串都要直接跳出，不过要根据跳出时候
      if (!firstOfNonTerminal[EPSILON]) {
        break
      }
    }
    const len = firstOfNonTerminalArr.length
    const flag = firstOfNonTerminalArr[len - 1][EPSILON]
    flag
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
// merge(first, firstOfNonTerminal, [EPSILON])

// 暂时规定不是大写的都是终结符
function isTerminal(symbol) {
  return !/[A-Z]/.test(symbol)
}

// 获得产生式左边有所需symbol的所有产生式子
function getProductionsForSymbol(symbol) {
  const productionsForSymbol = {}
  for (const k in grammar) {
    if (grammar[k][0] === symbol) {
      productionsForSymbol[k] = grammar[k]
    }
  }
  return productionsForSymbol
}

// 获得产生式右边有所需symbol的所有产生式子
function getProductionsWithSymbol(symbol) {
  var productionsWithSymbol = {}
  for (var k in grammar) {
    var production = grammar[k]
    var RHS = getRHS(production)
    if (RHS.indexOf(symbol) !== -1) {
      productionsWithSymbol[k] = production
    }
  }
  return productionsWithSymbol
}

function getRHS(production) {
  return production.split("->")[1].replace(/\s+/g, "")
}

function getLHS(production) {
  return production.split("->")[0].replace(/\s+/g, "")
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
