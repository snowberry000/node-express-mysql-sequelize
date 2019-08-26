module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Venue', {
        name:   DataTypes.STRING
    });

	  Model.associate = function(models){
	      Model.belongsTo(models.User);
	      Model.hasMany(models.Space);
	  };

    Model.prototype.toWeb = function (pw) {
        let json = this.toJSON();
        return json;
    };
    
    return Model;
};