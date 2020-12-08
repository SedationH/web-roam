const db = require('../config/db.config.js')
const File = db.file //  引入表模型
const Sequelize = require('sequelize')
const Op = Sequelize.Op
const path = require('path')
const fs = require('fs')

//  添加文件
exports.create = (req, res) => {
  let params = {
    file_name: req.files[0].originalname,
    hash_name: req.files[0].filename,
    upload_time:
      new Date().toLocaleDateString() +
      ' ' +
      new Date().toLocaleTimeString(),
    type: path.parse(req.files[0].originalname).ext,
    size: req.files[0].size,
    download: 0,
    uid: req.body.uid,
  }
  File.create(params)
    .then(file => {
      if (file) {
        let msg = {
          flag: 1,
          msg: '文件上传成功!',
        }
        res.status(200).json(msg)
      } else {
        let msg = {
          flag: 0,
          msg: '文件上传失败,请稍后重新上传!',
        }
        res.status(500).json(msg)
      }
    })
    .catch(err => {
      res.status(500).json('Error->' + err)
    })
}

//  删除文件
exports.delete = (req, res) => {
  const id = req.params.fileId
  File.destroy({
    where: { id: id },
  })
    .then(_ => {
      //  从资源文件夹从删除
      let fileName = req.params.fileName
      let path = `${__dirname}/../resource/${fileName}`
      fs.unlink(path, err => {
        if (err) {
          let msg = {
            flag: 0,
            msg: '删除失败!',
          }
          res.status(200).json(msg)
        } else {
          let msg = {
            flag: 1,
            msg: '删除成功!',
          }
          res.status(200).json(msg)
        }
      })
    })
    .catch(err => {
      res.status(500).json('Error=>', err)
    })
}

//  下载文件
exports.download = (req, res) => {
  let fileId = req.params.fileId
  File.findById(fileId).then(file => {
    file
      .increment('download')
      .then(file => {
        let fileName = req.params.fileName
        let path = `${__dirname}/../resource/${fileName}`
        res.download(path, fileName)
      })
      .catch(err => {
        res.status(500).json('Error=>', err)
      })
  })
}

//  获取文件列表信息
exports.findAll = (req, res) => {
  File.findAll({
    where: { uid: req.body.uid },
  })
    .then(file => {
      res.status(200).json(file)
    })
    .catch(err => {
      res.status(500).json('Error=>', err)
    })
}
