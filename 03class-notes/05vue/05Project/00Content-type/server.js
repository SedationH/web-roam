const Koa = require('koa')
const koaBody = require('koa-body')
const cors = require('@koa/cors')
const app = new Koa()

app.use(koaBody())
app.use(cors())
app.use(ctx => {
  ctx.body = `Request Body: ${JSON.stringify(
    ctx.request.body
  )}`
})

app.listen(3000)

console.log('https://localhost:3000')
