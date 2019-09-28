module.exports = function(sequelize, DataTypes) {
    var Articles = sequelize.define("Article", {
        userid: DataTypes.STRING,
        title: DataTypes.STRING,
        category: DataTypes.STRING,
        content: DataTypes.TEXT
    });
    return Articles;
}