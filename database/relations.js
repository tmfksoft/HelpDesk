const Sequelize = require('sequelize');

module.exports = (Models, Database)=>{
    Models.Category.hasMany( Models.Section );

    Models.Section.hasMany( Models.Article );
    Models.Section.belongsTo( Models.Category );

    Models.Article.belongsTo( Models.Section );
}