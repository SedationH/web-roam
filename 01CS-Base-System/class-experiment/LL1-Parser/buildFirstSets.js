import {
  buildSet,
  getProductionsWithSymbol,
  getRHS,
  merge,
  getProductionsForSymbol,
  isTerminal,
  EPSILON,
} from "./uitils.js"

export const firstSets = {}

export default function buildFirstSets(grammar) {
  buildSet(firstOf, grammar)
}

export function firstOf(symbol, grammar) {
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
    symbol,
    grammar
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
      let firstOfNonTerminal = firstOf(
        productionSymbol,
        grammar
      )

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
