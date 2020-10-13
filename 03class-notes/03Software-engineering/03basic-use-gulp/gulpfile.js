const { series, parallel } = require('gulp')
const fs = require('fs')
// 导出的函数都会作为gulp的任务
// 每个任务都被看作是异步任务
exports.foo = done => {
  console.log('foo task working~')
  done()
}

function task1(done) {
  console.log('task1')
  done()
}

function task2(done) {
  console.log('task2')
  done()
}

function task3(done) {
  console.log('task3')
  done()
}

// 按顺序
exports.fn = series(task1, task2, task3)
// 并行
exports.fun = parallel(task1, task2, task3)

// Gulp的异步处理方案
// 1. callback
// 2. Promise -> async
// 3. stream

exports.promiseError = () => {
  console.log('promise task')
  return Promise.reject(new Error('task failed'))
}


const timeout = time =>
  new Promise(resolve => setTimeout(resolve, time))

exports.async = async () => {
  await timeout(1000)
  console.log('async task')
}

exports.stream = () => {
  const read = fs.createReadStream('yarn.lock')
  const write = fs.createWriteStream('a.txt')
  // 这里可以理解为通过read出内容的管道，向内部流动
  read.pipe(
    write
  )
  return read
}

// gulp实际上是根据流的状态进行告知完成的 以下为上面stream的模拟
exports.simulateStream = done => {
  const read = fs.createReadStream('package.json')
  const write = fs.createWriteStream('a.txt')
  read.pipe(write)
  read.on('end', () => done())
}

// 体会基于流的文件处理过程
const { Transform } = require('stream')

exports.miniCss = () => {
  const readStream = fs.createReadStream('normalize.css')
  const writeStream = fs.createWriteStream('normalize.min.css')

  const transformStream = new Transform({
    transform: (chunk, encoding, cb) => {
      cb(
        null,
        chunk.toString().replace(/\s+/g, '').replace(/\/\*.*?\*\//g, '')
      )
    }
  })

  return readStream
    .pipe(transformStream)
    .pipe(writeStream)
}