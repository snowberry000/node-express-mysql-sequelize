const {TE, to}              = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Customer', {
        name:                DataTypes.STRING,
        phone:               DataTypes.STRING,
        email:               DataTypes.STRING,
        address:             DataTypes.STRING,
        vatNumber:           DataTypes.STRING,
        note:                DataTypes.TEXT
    });

    Model.associate = function(models){
        Model.belongsTo(models.User);
    };

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};