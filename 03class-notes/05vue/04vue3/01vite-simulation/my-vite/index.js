#!/usr/bin/env node

const Koa = require('koa')
const send = require('koa-send')

const app = new Koa()

// 1. 静态文件服务
app.use(async (ctx, next) => {
  await send(ctx, ctx.path, {
    root: process.cwd(),
    index: 'index.html',
  })
  await next()
})

app.listen(3000)

console.log('http://localhost:3000')
