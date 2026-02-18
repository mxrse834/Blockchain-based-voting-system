const mysql = require("mysql2/promise");
const config = require("../config/db.config");

const pool = mysql.createPool({
  host: config.host,
  user: config.user,
  password: config.password,
  database: config.database,
  port: config.port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection()
  .then(connection => {
    console.log("MySQL Database connected");
    connection.release();
  })
  .catch(err => {
    console.error("MySQL connection failed:", err);
  });

module.exports = pool;
