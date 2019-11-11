const {TE, to}              = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Bookingcolor', {
        color:               DataTypes.TEXT('long'),    
        UserId:              DataTypes.INTEGER,    
    });

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};