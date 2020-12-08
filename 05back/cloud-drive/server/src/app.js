console.log('Hello World!')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

require('../route/file.route')(app)
require('../route/user.route')(app)

app.get('/posts', (req, res) => {
  res.send([
    {
      title: 'Hello World!',
      description: 'Hi there! How are you?',
    },
  ])
})

app.listen(process.env.PORT || 8081)
