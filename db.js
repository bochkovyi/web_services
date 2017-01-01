"use strict";
const mysql = require("mysql");

const dbConfig = {
  host: "localhost",
  user: "developer",
  password: "password",
  database : 'db_name'
}

const dbConnection = mysql.createConnection(dbConfig);

dbConnection.connect(function(err, test) {
    if (err) {
        console.log('Error connecting to MySql database');
        process.exit();
    }
    console.log('MySql: Connection established');
});


module.exports = dbConnection;