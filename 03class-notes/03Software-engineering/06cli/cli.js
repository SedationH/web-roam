#!/usr/bin/env node

const inquery = require("inquirer")
const path = require("path")
const fs = require("fs")
const ejs = require("ejs")

inquery
  .prompt([
    {
      type: "input",
      name: "titleName",
      message: "Please input titleName: ",
    },
  ])
  .then((ans) => {
    const tmplDir = path.join(__dirname, "templates")
    const destDir = process.cwd()

    fs.readdir(tmplDir, (err, files) => {
      if (err) throw err
      files.forEach((file) => {
        ejs.renderFile(path.join(tmplDir, file), ans, (err, result) => {
          if (err) throw err

          fs.writeFileSync(path.join(destDir, file), result)
        })
      })
    })
  })
