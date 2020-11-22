import {
  buildSet,
  getProductionsWithSymbol,
  getRHS,
  merge,
  getLHS,
  EPSILON,
  findStart,
} from "./uitils.js"
import { firstOf } from "./buildFirstSets.js"

export const followSets = {}

export default function buildFollowSets(grammar) {
  buildSet(followOf, grammar)
}

function followOf(symbol, grammar) {
  if (followSets[symbol]) {
    return followSets[symbol]
  }
  const follow = (followSets[symbol] = {})
  if (symbol === findStart(grammar)) {
    follow["$"] = true
  }

  const productionsWithSymbol = getProductionsWithSymbol(
    symbol,
    grammar
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
          merge(follow, followOf(LHS, grammar))
        }
        break
      }

      const followSymbol = RHS[followIndex]

      const firstOfFollow = firstOf(followSymbol, grammar)

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
