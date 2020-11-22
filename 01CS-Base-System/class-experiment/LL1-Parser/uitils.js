import { buildNonTerminals } from "./buildParserTable.js"

export const EPSILON = "ε"

// Right hand side
export function getRHS(production) {
  return production.split("->")[1].replace(/\s+/g, "")
}

// Left hand side
export function getLHS(production) {
  return production.split("->")[0].replace(/\s+/g, "")
}

// 获得产生式左边有所需symbol的所有产生式子
export function getProductionsForSymbol(symbol, grammar) {
  const productionsForSymbol = {}
  for (const k in grammar) {
    if (grammar[k][0] === symbol) {
      productionsForSymbol[k] = grammar[k]
    }
  }
  return productionsForSymbol
}

// 获得产生式右边有所需symbol的所有产生式子
export function getProductionsWithSymbol(symbol, grammar) {
  const productionsWithSymbol = {}
  for (const k in grammar) {
    const production = grammar[k]
    const RHS = getRHS(production)
    if (RHS.indexOf(symbol) !== -1) {
      productionsWithSymbol[k] = production
    }
  }
  return productionsWithSymbol
}

export function merge(to, from, exclude = []) {
  for (const k in from) {
    if (exclude.indexOf(k) === -1) {
      to[k] = from[k]
    }
  }
}

// 暂时规定不是大写的都是终结符
export function isTerminal(symbol) {
  return !/[A-Z]/.test(symbol)
}

// 对grammar每个句子的首字母执行builder
export function buildSet(builder, grammar) {
  for (const k in grammar) {
    builder(grammar[k][0], grammar)
  }
}

export function printSet(name, set) {
  console.log(name + ": \n")
  for (const k in set) {
    console.log("  ", k, ":", Object.keys(set[k]))
  }
  console.log("")
}

export function printGrammar(grammar) {
  console.log("Grammar:\n")
  for (const k in grammar) {
    console.log("  ", grammar[k])
  }
  console.log("")
}

export function findStart(grammar) {
  // 需要拿到起始符号，非终结符，且只出现在式子左边
  //  -> 没有出现在产生式右边
  const nonTerminals = buildNonTerminals(grammar)
  // 拿到在产生式右边出现过的所有nonTerminals
  const hasAppearATRight = {}
  for (const k in grammar) {
    const RHSs = getRHS(grammar[k]).match(/([A-Z])/g)
    RHSs &&
      RHSs.forEach((e) => (hasAppearATRight[e] = true))
  }
  const ans = nonTerminals.filter(
    (e) => !hasAppearATRight[e]
  )
  if (ans.length === 1) {
    return ans[0]
  } else {
    throw Error("输入有误，起始字符不唯一")
  }
}
