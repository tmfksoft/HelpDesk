const Sequelize = require('sequelize');
module.exports = async (opts) => {
    const options = opts || {};

    const Database = new Sequelize({
        storage: "database.sqlite",
        dialect: "sqlite",
    });

    const Models = require('./models')(Database);

    // Setup relationships between them
    require('./relations')(Models, Database);

    // Sync the tables.
    for (let model of Object.values(Models)) {
        await model.sync({ force: options.forceSync || false });
    }

    return {
        Database,
        Models,
    };
}