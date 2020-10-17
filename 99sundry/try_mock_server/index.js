const jsonServer = require('json-server')
const server = jsonServer.create()
const middlewares = jsonServer.defaults()
const port = process.env.PORT || 3000

server.use(middlewares)

server.get('/users', (request, response) => {
  if (request.method === 'GET') {
    const users = require('./users/index')
    response.status(200).jsonp(users())
  }
})


server.listen(port, () => console.log('JSON Server is running http://127.0.0.1:3000'))