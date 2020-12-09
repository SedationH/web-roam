console.log('Hello World!')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const fs = require('fs')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

require('../route/file.route')(app)
require('../route/user.route')(app)

app.post('/posts', (req, res) => {
  let temp = ''
  Object.entries(req).forEach(arr => {
    temp += arr[0] + '\n'
  })
  fs.writeFileSync('log', JSON.stringify(req.body))
  res.send([
    {
      title: 'Hello World!',
      description: 'Hi there! How are you?',
    },
  ])
})

app.listen(process.env.PORT || 8081)
