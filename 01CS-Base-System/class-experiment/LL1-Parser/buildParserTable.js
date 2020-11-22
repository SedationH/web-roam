import Table from "cli-table"

import { getRHS, getLHS, EPSILON } from "./uitils.js"
import { firstSets } from "./buildFirstSets.js"
import { followSets } from "./buildFollowSets.js"

const terminals = []
const nonTerminals = []

export function buildNonTerminals(grammar) {
  for (const k in grammar) {
    let temp = getLHS(grammar[k])
    if (nonTerminals.indexOf(temp) == -1) {
      nonTerminals.push(temp)
    }
  }
  return nonTerminals
}

export function buildTerminals(grammar) {
  for (const k in grammar) {
    let temp = getRHS(grammar[k])
    for (let i = 0; i < temp.length; i++) {
      if (
        nonTerminals.indexOf(temp[i]) == -1 &&
        terminals.indexOf(temp[i]) == -1
      ) {
        terminals.push(temp[i])
      }
    }
  }
  return terminals
}

export function buildParserTable(grammar) {
  const analyseTable = {}

  for (const k in grammar) {
    const itRHS = getRHS(grammar[k])
    const itLHS = getLHS(grammar[k])

    analyseTable[itLHS] = analyseTable[itLHS] || {}
    if (itRHS !== EPSILON) {
      const tempTerminals = firstSets[itRHS[0]]
      for (const temp in tempTerminals) {
        analyseTable[itLHS][temp] = grammar[k]
      }
    } else {
      const tempTerminals = followSets[itLHS]
      for (const temp in tempTerminals) {
        analyseTable[itLHS][temp] = grammar[k]
      }
    }
  }
  return analyseTable
}

export function drawParsingTable(analyseTable) {
  let table = new Table({
    head: ["", ...terminals, "$"],
  })
  nonTerminals.map((nonTerminalItem) => {
    const row = [nonTerminalItem]
    terminals.forEach((terminalItem) => {
      row.push(
        analyseTable[nonTerminalItem][terminalItem] || ""
      )
    })
    row.push(analyseTable[nonTerminalItem]["$"] || "")

    table.push([...row])
  })
  console.log(table.toString())
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

export function isValid(start, analyseTable, inputText) {
  // 根据分析表来分析text是否合法
  // analyseTable[nonTerminal][terminal]
  const analyseStack = ["$", start],
    text = inputText + "$",
    log = []
  let pc = 0
  let pText = 0
  try {
    while (analyseStack.length > 0) {
      const currAnalyseStack = analyseStack.slice(),
        stackTop = analyseStack.pop(),
        currChar = text[pText],
        currPText = pText
      let action
      // 要么匹配 要么搞出新的产生式子
      if (stackTop === currChar) {
        pText++
        action = `Match: ${currChar}`
      } else {
        const currGrammar =
            analyseTable[stackTop][currChar],
          rhs = getRHS(currGrammar)
        action = currGrammar
        if (rhs[0] !== EPSILON)
          analyseStack.push(...Array.from(rhs).reverse())
      }

      log.push({
        step: pc++,
        analyseStack: currAnalyseStack.slice(),
        remain: text.slice(currPText),
        action,
      })
    }
  } catch (error) {
    console.log("不匹配", error)
  }
  const analyseTableAns = new Table({
    head: ["Step", "AnalyseStack", "RemainText", "Action"],
    colors: true,
  })
  for (const e in log) {
    analyseTableAns.push([
      log[e].step,
      log[e].analyseStack,
      log[e].remain,
      log[e].action,
    ])
  }
  console.log(analyseTableAns.toString())
}
