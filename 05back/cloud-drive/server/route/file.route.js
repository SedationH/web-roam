//  文件
module.exports = function (app) {
  const file = require('../controller/file.controller')

  //  新增文件
  app.post('/file/add', file.create)

  //  删除文件
  app.delete('/file/delete/:fileName/:fileId', file.delete)

  // 下载文件
  app.get('/file/download/:fileName/:fileId', file.download)

  // 获取文件信息列表
  app.post('/file/list', file.findAll)
}
