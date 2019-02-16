module.exports = (database) => {
    return {
        Article: require('./models/Article.js')(database),
        Category: require('./models/Category.js')(database),
        Section: require('./models/Section.js')(database),
    }
};