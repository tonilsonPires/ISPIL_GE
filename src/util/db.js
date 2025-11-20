const  mysql = require("mysql")
const util = require("util")
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || 'root',
    port: process.env.DB_PORT || 3306,
    password: process.env.DB_PASSWORD || "klb@@13%",
    database: process.env.DB_DATABASE || "ispil_db"
})
// promise wrapper to enable async await with MYSQL
// https://medium.com/fullstackwebdev/a-guide-to-mysql-with-node-js-fc4f6abce33b
db.query = util.promisify(db.query).bind(db);


module.exports = db