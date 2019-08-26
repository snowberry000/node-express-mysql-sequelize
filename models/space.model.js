module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Space', {
        name:   DataTypes.STRING
    });

	Model.associate = function(models){
	    Model.belongsTo(models.Venue);
    };

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };
    
    return Model;
};