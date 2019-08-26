module.exports = (sequelize, DataTypes) => {
    var Model = sequelize.define('Status', {
        name:           DataTypes.STRING,
        type:           {type: DataTypes.STRING, defaultValue: 'custom'},
        parentId:       DataTypes.STRING,
        order:          DataTypes.BIGINT,
        active:         {type: DataTypes.BOOLEAN, defaultValue: true}
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