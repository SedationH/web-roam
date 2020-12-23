const Vue = require('vue')
// 第 1 步：创建一个 renderer
const renderer = require('vue-server-renderer').createRenderer(
  {
    template: require('fs').readFileSync(
      './index.template.html',
      'utf-8'
    ),
  }
)
// 第2步：创建 service
const service = require('express')()

const context = {
  title: 'vue ssr demo',
  meta: `
        <meta name="keyword" content="vue,ssr">
        <meta name="description" content="vue srr demo">
    `,
}

service.get('/', (req, res) => {
  // 设置响应头，解决中文乱码 尽管上文
  res.setHeader('Content-Type', 'text/html;charset=utf8')

  // 第 3 步：创建一个 Vue 实例
  const app = new Vue({
    template: `
      <div>{{ message }}</div>`,
    data: {
      message: 'Hello World',
    },
  })

  // 第 4 步：将 Vue 实例渲染为 HTML
  renderer.renderToString(app, context, (err, html) => {
    // 异常时，抛500，返回错误信息，并阻止向下执行
    if (err) {
      res.status(500).end('Internal Server Error')
      return
    }

    // 返回HTML, 该html的值 将是注入应用程序内容的完整页面
    res.end(html)
  })
})

// 绑定并监听指定主机和端口上的连接
service.listen(3000, () =>
  console.log(`service listening at http://localhost:3000`)
)
