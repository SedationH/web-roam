#!/usr/bin/env node

const { rejects } = require('assert')
const Koa = require('koa')
const send = require('koa-send')
const { resolve } = require('path')
const { Readable, Stream } = require('stream')

const app = new Koa()

const streamToString = stream =>
  new Promise((resolve, reject) => {
    const chunks = []
    stream.on('data', chunk => chunks.push(chunk))
    stream.on('end', () => {
      resolve(Buffer.concat(chunks).toString('utf-8'))
    })
    stream.on('error', reject)
  })

// 1. 静态文件服务
app.use(async (ctx, next) => {
  await send(ctx, ctx.path, {
    root: process.cwd(),
    index: 'index.html',
  })
  await next()
})

// 2. 修改Relative references must start with
//  either "/", "./", or "../".
app.use(async (ctx, next) => {
  // 如果请求的文件是application/javascript
  if (ctx.type === 'application/javascript') {
    const contents = await streamToString(ctx.body)
    ctx.body = contents.replace(
      /(from\s+['"])(?![\.\/])/,
      '$1/@modules/'
    )
  }
})

app.listen(3000)

console.log('http://localhost:3000')
