const {TE, to}              = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Calendarsetting', {
        viewMode:             DataTypes.STRING,
        selectedDate:         DataTypes.DATE,
        viewExpand:           DataTypes.BOOLEAN,    
        UserId:               DataTypes.INTEGER,
    });

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};