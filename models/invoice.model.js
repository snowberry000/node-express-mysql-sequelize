const {TE, to}              = require('../services/util.service');

module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Invoice', {
        customerId:            DataTypes.BIGINT,
        payment_method:        DataTypes.STRING,
        slots:                 DataTypes.TEXT,
        cost_items:            DataTypes.TEXT,
        sub_total:             DataTypes.FLOAT,
        discount:              {type: DataTypes.INTEGER, validate: {min:0, max:100}},
        tax:                   DataTypes.FLOAT,
        grand_total:           DataTypes.FLOAT
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