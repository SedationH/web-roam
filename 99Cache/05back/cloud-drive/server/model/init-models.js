var DataTypes = require("sequelize").DataTypes;
var _file = require("./file");
var _user = require("./user");

function initModels(sequelize) {
  var file = _file(sequelize, DataTypes);
  var user = _user(sequelize, DataTypes);

  file.belongsTo(user, { foreignKey: "uid"});
  user.hasMany(file, { foreignKey: "uid"});

  return {
    file,
    user,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
