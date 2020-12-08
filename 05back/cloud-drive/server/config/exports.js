const env = require('./env.js')
const SequelizeAuto = require('sequelize-auto')

const auto = new SequelizeAuto(
  env.database,
  env.username,
  env.password,
  {
    dialect: 'mysql',
  }
)
auto.run().then(data => {
  const tableNames = Object.keys(data.tables)
  console.log(tableNames) // table list
  // console.log(data.foreignKeys); // foreign key list
  // console.log(data.text)         // text of generated files
})
