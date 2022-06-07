// import the sequalize constructor from the library
const Sequalize = require('sequelize');

// create connection to db, pass in mysql info
const sequalize = new Sequalize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

module.exports = sequalize;