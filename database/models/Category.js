const Sequelize = require('sequelize');

module.exports = (Database) => {
    const Category = Database.define('category',{
        title: Sequelize.STRING,
        summary: Sequelize.STRING,
        slug: Sequelize.STRING,
    });
    return Category;
}