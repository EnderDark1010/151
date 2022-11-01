const jwt =require("jsonwebtoken")




function sendInvalidParamError(res) {
  res.status(401).json({ message: "Invalid Paramters" });
}

function verifyToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    next();
  } else {
    res.sendStatus(403);
    return;
  }
}

function verifyAdminRole(req, res, next) {
  const mysql = require("mysql");
  const pool = mysql.createPool({
    connectionLimit: 50,
    timeout: 5000,
    host: "localhost",
    user: "master",
    password: "master",
    database: "151",
  });

  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader == "undefined") {
    res.sendStatus(403);
    return;
  }
  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];
  req.token = bearerToken;
  let decodedToken =jwt.decode(req.token);
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query("INSERT IGNORE INTO user (id) VALUES(?)",[decodedToken.sub],(err, rows) => {
      if (!err) {
        connection.query("SELECT * FROM `user` WHERE `id`=?",[decodedToken.sub],(err, rows) => {
          if(rows[0].admin!==1){
            res.sendStatus(403);
            return;
          }
        });
      }else{
        res.sendStatus(403);
        return;
      }
      
    });
    
  });

  next();
}

module.exports = {
  
  verifyToken,
  sendInvalidParamError,

  verifyAdminRole
};
