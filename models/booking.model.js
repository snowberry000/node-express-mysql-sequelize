const {TE, to}              = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Booking', {
        eventName:             DataTypes.STRING,
        venueId:               DataTypes.BIGINT,
        spaceId:               DataTypes.BIGINT,
        customerId:            DataTypes.BIGINT,
        ownerId:               DataTypes.BIGINT,
        statusId:              DataTypes.BIGINT,
        slots:                 DataTypes.TEXT,
        note:                  DataTypes.TEXT,
        calls:                 DataTypes.TEXT, 
    });

    Model.associate = function(models){
        Model.belongsTo(models.User);
        Model.hasMany(models.Quote);
        Model.hasMany(models.Invoice);
    };

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};