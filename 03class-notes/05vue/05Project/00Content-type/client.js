const axios = require('axios')
const qs = require('qs')

const request = axios.create({
  baseURL: 'http://localhost:3000',
})

const q1 = request.post('/', {
  name: 'SedationH',
  age: 21,
  type: 'application/json',
})

const q2 = request.post(
  '/',
  qs.stringify({
    name: 'SedationH',
    age: 21,
    type: 'application/x-www-form-urlencoded',
  })
)

const ans = Promise.all([q1, q2])

console.log(ans)
