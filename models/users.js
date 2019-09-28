module.exports = function(sequelize, DataTypes) {
    var Users = sequelize.define("User", {
        username: DataTypes.STRING,
        password: DataTypes.TEXT,
        role: DataTypes.STRING,
    });
    return Users;
}