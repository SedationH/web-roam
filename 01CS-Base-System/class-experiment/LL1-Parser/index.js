import Table from "cli-table"
import { printGrammar, printSet } from "./uitils.js"
import buildFirstSets, {
  firstSets,
} from "./buildFirstSets.js"
import buildFollowSets, {
  followSets,
} from "./buildFollowSets.js"
import {
  buildNonTerminal,
  buildTerminals,
  buildParserTable,
} from "./buildParserTable.js"

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
  6: `Q -> ε`,
}

export const START_SYMBOL = "X"

const text = "a+a*a+a"

function startUp(grammar, text) {
  printGrammar(grammar)
  buildFirstSets(grammar)
  buildFollowSets(grammar)
  printSet("First sets", firstSets)
  printSet("Follow sets", followSets)
  buildNonTerminals(grammar)
  buildTerminals(grammar)
  const analyseTable = buildParserTable(grammar)
  drawParsingTable(analyseTable)
}

function drawParsingTable(ptable) {
  let table = new Table({
    head: ["", ...terminals, "$"],
  })
  nonTerminals.map((nonTerminalItem) => {
    let arr = []
    terminals.map((terminalItem) => {
      arr.push(ptable[nonTerminalItem][terminalItem] || "")
    })
    arr.push(ptable[nonTerminalItem]["$"] || "")

    // console.log(ptable[item]);
    table.push([nonTerminalItem, ...arr])
  })
  console.log(table.toString())
}
