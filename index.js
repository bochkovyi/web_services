"use strict";

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require("mysql");
const db = require('./db');

const apiTemplate = {
    GET: "/departments, /departments:id",
    POST: "/departments",
    PUT: "/departments:id"
}

// To work with JSON requests (application/json header)
app.use(bodyParser.json());

// To work with x-www-form-urlencoded data
/*
app.use(bodyParser.urlencoded({
    extended: true
}));
*/

app.get('/', function(req, res) {
    res.json(apiTemplate);
})

app.route('/departments')
    .get(function(req, res) {
        db.query('SELECT * FROM departments', function(err, rows) {
            if (err) res.json({
                error: err
            });
            else {
                res.json(rows);
            }
        });
    })
    .post(function(req, res) {
        let reqData = req.body;
        if (!reqData.name) {
            res.json({
                error: "Department name not provided"
            });
        } else {
            let data = {
                    name: reqData.name,
                    description: reqData.description
                }
                // ?-construction is safe and equivalent to mysql.escape(userVariable)
            db.query('INSERT INTO departments SET ?', data, function(err, result) {
                if (err) res.json({
                    error: err
                });
                else {
                    res.json(result);
                }
            });
        }
    })

app.route('/departments/:id')
    .get(function(req, res) {
        db.query('SELECT * FROM departments WHERE id = ?', req.params.id, function(err, rows) {
            if (err) res.json({
                error: err
            });
            else {
                res.json(rows);
            }
        });
    })
    .put(function(req, res) {
        let reqData = req.body;
        if (!reqData.name) {
            res.json({
                error: "Department name not provided"
            });
        } else {
            let data = {
                name: reqData.name,
                description: reqData.description
            }
            db.query('UPDATE departments SET ? WHERE id = ?', [data, req.params.id], function(err, result) {
                if (err) res.json({
                    error: err
                });
                else {
                    res.json(result);
                }
            });
        }
    })

// Other API calls are not supported
app.all("*", function(req, res) {
    res.status(400).json({
        error: "This API call is not supported"
    });
});


app.listen(3000, function() {
    console.log('Listening on port 3000!');
});

// Correctly handle CTRL+C on Windows: http://stackoverflow.com/a/14861513/6880261
if (process.platform === "win32") {
    var rl = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on("SIGINT", function() {
        process.emit("SIGINT");
    });
}

process.on("SIGINT", function() {
    //graceful shutdown
    console.log("exiting")
    db.end(function(err) {
        // The connection is terminated gracefully
        // Ensures all previously enqueued queries are still
        // before sending a COM_QUIT packet to the MySQL server.
        if (err) console.error(err);
        else console.log("MySQL disconnected");
        process.exit();
    });

});