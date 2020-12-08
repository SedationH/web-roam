const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('file', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "文件id"
    },
    file_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: "文件名称"
    },
    hash_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: "文件hash名称"
    },
    upload_time: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "上传时间"
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "文件类型"
    },
    size: {
      type: DataTypes.STRING(20),
      allowNull: false,
      comment: "文件大小"
    },
    download: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "下载次数"
    },
    uid: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
      comment: "用户id",
      references: {
        model: 'user',
        key: 'uid'
      }
    }
  }, {
    sequelize,
    tableName: 'file',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "uid",
        using: "BTREE",
        fields: [
          { name: "uid" },
        ]
      },
    ]
  });
};
