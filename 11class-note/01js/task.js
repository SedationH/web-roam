const fs = require('fs')
const { task } = require('folktale/concurrency/task')
const { find, split, flowRight } = require('lodash/fp')

function readFile(filename) {
  return task(resolver => {
    fs.readFile(filename, 'utf-8', (err, data) => {
      if (err) resolver.reject(err)
      resolver.resolve(data)
    })
  })
}

// 这里的run 有_.value()的感觉
readFile('package.json')
  // .map(split('\n'))
  // .map(find(line => line.includes('version')))
  .map(
    flowRight(
      find(line => line.includes('version')),
      split('\n')
    )
  )
  .run()
  .listen({
    onRejected: err => console.log(err),
    onResolved: value => console.log(value)
  })

