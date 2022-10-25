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
      "SELECT * FROM user WHERE username=? AND password=?",
      [username,password],
      (err, rows) => {
        connection.release();
        if (!err) {
          if (rows.length > 0) {
            const token = generateAccessToken({ username: username });
            res.json(token);
          } else {
            res.sendStatus(403);
          }
        } else {
          res.send(err);
        }
      }
    );
  });
});

//register
app.put("/register", (req, res) => {
    let { username, password } = req.body;
    if (typeof username != "string" || typeof password != "string") {
      res.send("Invalid parameters!");
      return;
    }
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        "INSERT INTO user (username, password) VALUES (?, ?)",
        [username,password],
        (err, rows) => {
          connection.release();
          if (!err) {
            const token = generateAccessToken({username:username});
            res.json(token);
          } else {
            res.send(rows);
          }
        }
      );
    });
  });

  //public endpoint
  app.get("/table/user",(req, res) => {
    let { table} = req.params;
    pool.getConnection((err, connection) => {
      if (err) throw err;
      connection.query(
        "SELECT id,username from user",
        [table],
        (err, rows) => {
          connection.release();
          if (!err) {
            res.send(rows);
          } else {
            res.send(err);
          }
        }
      );
    });
  });

app.listen(port, () => console.log("listen on port:" + port));



function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['Authorization']
    const token = authHeader.replace("token=","");
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }