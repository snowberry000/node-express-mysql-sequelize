const {TE, to}              = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Company', {
        name:               DataTypes.STRING,
        vatId:              DataTypes.STRING,
        street:             DataTypes.STRING,
        city:               DataTypes.STRING,
        postCode:           DataTypes.STRING,
        phone:              DataTypes.STRING,
        currency:           DataTypes.STRING,
        vatRate:            DataTypes.STRING
    });

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};