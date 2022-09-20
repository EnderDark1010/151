const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const app = express();
const sharp = require("sharp");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
app.use(cors());
dotenv.config();
const port = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "500mb" }));

const pool = mysql.createPool({
  connectionLimit: 50,
  timeout: 5000,
  host: "localhost",
  user: "master",
  password: "master",
  database: "151",
});

//Login
app.get("/login/:username/:password", (req, res) => {
  let { username, password } = req.params;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    if (typeof username != "string" || typeof password != "string") {
      res.send("Invalid parameters!");
      return;
    }
    connection.query(
      "SELECT * FROM User WHERE username = ? AND password = ?",
      [username, password],
      (err, rows) => {
        connection.release();
        if (!err) {
          if (rows.length > 0) {
            const token = generateAccessToken({ username: username });
            res.json(token);
          } else {
            res.send("err");
          }
        } else {
          res.send(err);
        }
      }
    );
  });
});

//register
app.post("/register", (req, res) => {
    let { username, password } = req.body;
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        "INSERT INTO user (username, password) VALUES (?, ?)",
        [username,password],
        (err, rows) => {
          connection.release();
          if (!err) {
            res.send(rows);
          } else {
            res.send(rows);
          }
        }
      );
    });
  });

app.listen(port, () => console.log("listen on port:" + port));

function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}