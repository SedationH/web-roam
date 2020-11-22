import Table from "cli-table"

import { getRHS, getLHS, EPSILON } from "./uitils.js"
import { firstSets } from "./buildFirstSets.js"
import { followSets } from "./buildFollowSets.js"

const terminals = []
const nonTerminals = []

export function buildNonTerminals(grammar) {
  for (var k in grammar) {
    let temp = getLHS(grammar[k])
    if (nonTerminals.indexOf(temp) == -1) {
      nonTerminals.push(temp)
    }
  }
  console.log("NonTerminals: " + nonTerminals)
}

export function buildTerminals(grammar) {
  for (var k in grammar) {
    let temp = getRHS(grammar[k])
    for (var i = 0; i < temp.length; i++) {
      if (
        nonTerminals.indexOf(temp[i]) == -1 &&
        terminals.indexOf(temp[i]) == -1
      ) {
        terminals.push(temp[i])
      }
    }
  }
  console.log("Terminals: " + terminals)
}

export function buildParserTable(grammar) {
  const ptable = {}

  for (const k in grammar) {
    const itRHS = getRHS(grammar[k])
    const itLHS = getLHS(grammar[k])

    ptable[itLHS] = ptable[itLHS] || {}
    if (itRHS !== EPSILON) {
      const tempTerminals = firstSets[itRHS[0]]
      for (const temp in tempTerminals) {
        ptable[itLHS][temp] = grammar[k]
      }
    } else {
      const tempTerminals = followSets[itLHS]
      for (const temp in tempTerminals) {
        ptable[itLHS][temp] = grammar[k]
      }
    }
  }
  return ptable
}

export function drawParsingTable(ptable) {
  let table = new Table({
    head: ["", ...terminals, "$"],
  })
  nonTerminals.map((nonTerminalItem) => {
    const row = [nonTerminalItem]
    terminals.forEach((terminalItem) => {
      row.push(ptable[nonTerminalItem][terminalItem] || "")
    })
    row.push(ptable[nonTerminalItem]["$"] || "")

    table.push([...row])
  })
  console.log(table.toString())
}
