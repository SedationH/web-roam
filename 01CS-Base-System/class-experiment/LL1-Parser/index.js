import { printGrammar, printSet } from "./uitils.js"
import buildFirstSets, {
  firstSets,
} from "./buildFirstSets.js"
import buildFollowSets, {
  followSets,
} from "./buildFollowSets.js"
import {
  buildNonTerminals,
  buildTerminals,
  buildParserTable,
  drawParsingTable,
  findStart,
  isValid,
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

const text = "a"

function startUp(grammar, text) {
  printGrammar(grammar)
  buildFirstSets(grammar)
  buildFollowSets(grammar)
  printSet("First sets", firstSets)
  printSet("Follow sets", followSets)
  console.log("NonTerminals: " + buildNonTerminals(grammar))
  console.log("Terminals: " + buildTerminals(grammar))
  const analyseTable = buildParserTable(grammar)
  drawParsingTable(analyseTable)
  const start = findStart(grammar)
  isValid(start, analyseTable, text)
}

startUp(grammar, text)
