const Sequelize = require('sequelize');

module.exports = (Database) => {
    const Section = Database.define('section',{
        title: Sequelize.STRING,
        summary: Sequelize.STRING,
        slug: Sequelize.STRING,
        categoryId: Sequelize.INTEGER,
    });
    return Section;
}