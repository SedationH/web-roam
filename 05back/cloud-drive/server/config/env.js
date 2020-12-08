//  数据库连接参数
const env = {
  database: "cloud_drive",
  username: "root",
  password: "",
  host: "localhost",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
}
module.exports = env
