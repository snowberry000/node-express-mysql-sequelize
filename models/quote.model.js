const {TE, to}              = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Quote', {
        slots:                 DataTypes.TEXT,
        costItems:             DataTypes.TEXT,
        value:                 DataTypes.FLOAT,
        discount:              {type: DataTypes.INTEGER, validate: {min:0, max:100}},
        note:                  DataTypes.TEXT
    });

    Model.associate = function(models){
        Model.belongsTo(models.Booking);
    };

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };

    return Model;
};