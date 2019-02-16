const Sequelize = require('sequelize');

module.exports = (Database)=>{
    const Article = Database.define('article',{
        title: Sequelize.STRING,
        summary: Sequelize.STRING,
        body: Sequelize.STRING,
        slug: Sequelize.STRING,
        author: Sequelize.BOOLEAN,
        sectionId: Sequelize.INTEGER,
    });
    return Article;
}