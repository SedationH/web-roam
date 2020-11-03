const Koa = require("koa")
const app = new Koa()
const bodyParser = require("koa-bodyparser")

app.use(
  bodyParser({
    multipart: true,
    formLimit: "10mb",
    jsonLimit: "10mb",
    textLimit: "10mb",
    enableTypes: ["json", "form", "text"],
  })
)

app.use(async (ctx) => {
  ctx.body = "hello koa or hello world!"
  console.log(ctx.request.body)
})

app.listen(3000, () => {
  console.log("ok")
})
