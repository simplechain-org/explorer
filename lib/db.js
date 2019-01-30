const Sequelize = require("sequelize");
const config = new(require('../config.js'))();

// const dbPool = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, {
//     host: config.mysql.host,
//     dialect: 'mysql',
//     connectionTimeout:0,
//     pool: {
//         max: 5,
//         min: 0,
//         idle: 20000,
//         acquire: 20000
//     },
//     isolationLevel: 'READ UNCOMMITTED',
//     logging:false
// });

// setInterval(() => {
//     dbPool
//       .query("SELECT 'connection is successful'", {
//         type: Sequelize.QueryTypes.SELECT
//       })
//       .then((results) => {
//         console.log(results);
//       })
//       .catch((err) => {
//         console.log(err);
//       })
// }, 5000);

module.exports = global.db || (global.db = new Sequelize(config.mysql.database, config.mysql.user, config.mysql.password, {
    host: config.mysql.host,
    dialect: 'mysql',
    connectionTimeout: 0,
    pool: {
        max: 5,
        min: 0,
        idle: 20000,
        acquire: 20000
    },
    isolationLevel: 'READ UNCOMMITTED',
    logging: false,
    timezone: '+08:00'
}));