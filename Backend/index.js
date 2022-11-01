const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");

const {
  verifyToken,
  sendIsNotAdminError,
  sendInvalidParamError,
  isAdmin,
  verifyAdminRole,
} = require("./functions/HTTPVerification");
const { getMimeTypeFromDataURI } = require("./functions/Blob");
const { sanitizeXSS } = require("./functions/Sanitize");

const port = process.env.PORT || 5000;
app.use(cors());
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

//movie
app.post("/movie", verifyToken, verifyAdminRole, (req, res) => {
  let { name, image_id, director_id, fsk } = req.body;

  name = sanitizeXSS(name);
  if (
    !(typeof name == "string") ||
    !(typeof image_id == "number") ||
    !(typeof director_id == "number") ||
    !(typeof fsk == "number")
  ) {
    sendInvalidParamError(res);
    return;
  }
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "INSERT INTO movie (name,image_id,director_id,fsk_id) VALUES (?,?,?,?)",
      [name, image_id, director_id, fsk],
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
app.delete("/movie", verifyToken, verifyAdminRole, (req, res) => {
  let { id } = req.body;
  if (!(typeof id == "number")) {
    sendInvalidParamError(res);
    return;
  }
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query("DELETE FROM movie WHERE id=?", [id], (err, rows) => {
      connection.release();
      if (!err) {
        res.send(rows);
      } else {
        res.send(err);
      }
    });
  });
});
app.get("/movie", verifyToken, (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      `SELECT
    movie.id, movie.name, CONCAT(image.prefix,TO_BASE64(image.img)) AS img, CONCAT(director.firstname," ",director.lastname) AS director, CONCAT(fskImg.prefix, TO_BASE64(fskImg.img) ) AS fsk,
    GROUP_CONCAT(DISTINCT CONCAT(actor.firstname," ",actor.lastname) SEPARATOR ', ') AS actors,
    GROUP_CONCAT(DISTINCT genre.name SEPARATOR ', ') AS genres
FROM
    movie
    left JOIN actor_movie ON actor_movie.movie_id = movie.id
    left JOIN actor ON actor.id=actor_movie.actor_id
    left join movie_genres on movie_genres.movie_id=movie.id
    left join genre on genre.id=movie_genres.genre_id
    left join image on image.id=movie.image_id
    left join director on director.id=movie.director_id
    left join fsk on fsk.id=movie.fsk_id
    left join image as fskImg on fskImg.id=fsk.image_id
GROUP BY movie.name`,
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
app.get("/movie/:id", verifyToken, (req, res) => {
  let id = req.params.id;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      `SELECT * FROM movie
WHERE movie.id=?`,
      [id],
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
app.put("/movie", verifyToken, verifyAdminRole, (req, res) => {
  let { id, name, image_id, director_id, fsk } = req.body;
  name = sanitizeXSS(name);
  if (
    !(typeof id == "number") ||
    !(typeof name == "string") ||
    !(typeof image_id == "number") ||
    !(typeof director_id == "number") ||
    !(typeof fsk == "number")
  ) {
    sendInvalidParamError(res);
    return;
  }
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      `UPDATE movie SET name=?, image_id=?, director_id=?, fsk_id=? WHERE id=?`,
      [name, image_id, director_id, fsk, id],
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

//genre
app.post("/genre", verifyToken, verifyAdminRole, (req, res) => {
  let { name } = req.body;
  console.log(req.body);

  name = sanitizeXSS(name);
  if (!(typeof name == "string")) {
    sendInvalidParamError(res);
    return;
  }
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "INSERT INTO genre (name) VALUES (?)",
      [name],
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
app.delete("/genre", verifyToken, verifyAdminRole, (req, res) => {
  let { id } = req.body;

  if (!(typeof id == "number")) {
    sendInvalidParamError(res);
    return;
  }
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query("DELETE FROM genre WHERE id=?", [id], (err, rows) => {
      connection.release();
      if (!err) {
        res.send(rows);
      } else {
        res.send(err);
      }
    });
  });
});
app.get("/genre", verifyToken, (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      `SELECT genre.id,genre.name,GROUP_CONCAT(DISTINCT movie.name SEPARATOR ', ') FROM genre
LEFT JOIN movie_genres on movie_genres.genre_id=genre.id
left JOIN movie on movie.id=movie_genres.movie_id
GROUP BY genre.id`,
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
app.get("/genre/:id", verifyToken, (req, res) => {
  let id = req.params.id;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      `SELECT * FROM genre
WHERE genre.id=?`,
      [id],
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
app.put("/genre", verifyToken, verifyAdminRole, (req, res) => {
  let { id, name } = req.body;
  name = sanitizeXSS(name);
  if (!(typeof id == "number") || !(typeof name == "string")) {
    sendInvalidParamError(res);
    return;
  }
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      `UPDATE genre SET name=? WHERE id=?`,
      [name, id],
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

//director
app.post("/director", verifyToken, verifyAdminRole, (req, res) => {
  let { firstName, lastName } = req.body;

  firstName = sanitizeXSS(firstName);
  lastName = sanitizeXSS(lastName);
  if (!(typeof firstName == "string") || !(typeof lastName == "string")) {
    sendInvalidParamError(res);
    return;
  }
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "INSERT INTO director (firstname,lastname) VALUES (?,?)",
      [firstName, lastName],
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
app.delete("/director", verifyToken, verifyAdminRole, (req, res) => {
  let { id } = req.body;
  if (!(typeof id == "number")) {
    sendInvalidParamError(res);
    return;
  }
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query("DELETE FROM director WHERE id=?", [id], (err, rows) => {
      connection.release();
      if (!err) {
        res.send(rows);
      } else {
        res.send(err);
      }
    });
  });
});
app.get("/director", verifyToken, (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      `SELECT director.id,director.firstname,director.lastname,GROUP_CONCAT(DISTINCT movie.name SEPARATOR ', ') FROM director
LEFT JOIN movie on movie.director_id=director.id
GROUP BY director.id`,
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
app.get("/director/:id", verifyToken, (req, res) => {
  let id = req.params.id;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      `SELECT * FROM director
WHERE director.id=?`,
      [id],
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
app.put("/director", verifyToken, verifyAdminRole, (req, res) => {
  let { id, firstName, lastName } = req.body;

  firstName = sanitizeXSS(firstName);
  lastName = sanitizeXSS(lastName);
  if (
    !(typeof id == "number") ||
    !(typeof firstName == "string") ||
    !(typeof lastName == "string")
  ) {
    sendInvalidParamError(res);
    return;
  }
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      `UPDATE director SET firstname=?,lastname=? WHERE id=?`,
      [firstName, lastName, id],
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

//actor
app.post("/actor", verifyToken, verifyAdminRole, (req, res) => {
  let { firstName, lastName } = req.body;

  firstName = sanitizeXSS(firstName);
  lastName = sanitizeXSS(lastName);
  if (!(typeof firstName == "string") || !(typeof lastName == "string")) {
    sendInvalidParamError(res);
    return;
  }
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "INSERT INTO actor (firstname,lastname) VALUES (?,?)",
      [firstName, lastName],
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
app.delete("/actor", verifyToken, verifyAdminRole, (req, res) => {
  let { id } = req.body;
  if (!(typeof id == "number")) {
    sendInvalidParamError(res);
    return;
  }
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query("DELETE FROM actor WHERE id=?", [id], (err, rows) => {
      connection.release();
      if (!err) {
        res.send(rows);
      } else {
        res.send(err);
      }
    });
  });
});
app.get("/actor", verifyToken, (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      `SELECT actor.id,actor.firstname,actor.lastname,GROUP_CONCAT(DISTINCT movie.name SEPARATOR ', ') FROM actor
LEFT JOIN actor_movie on actor_movie.actor_id=actor.id
LEFT JOIN movie on movie.id=actor_movie.movie_id
GROUP BY actor.id`,
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
app.get("/actor/:id", verifyToken, (req, res) => {
  let id = req.params.id;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      `SELECT * FROM actor
WHERE actor.id=?`,
      [id],
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
app.put("/actor", verifyToken, verifyAdminRole, (req, res) => {
  let { id, firstName, lastName } = req.body;

  firstName = sanitizeXSS(firstName);
  lastName = sanitizeXSS(lastName);
  if (
    !(typeof id == "number") ||
    !(typeof firstName == "string") ||
    !(typeof lastName == "string")
  ) {
    sendInvalidParamError(res);
    return;
  }
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      `UPDATE actor SET firstname=?,lastname=? WHERE id=?`,
      [firstName, lastName, id],
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

//image
app.post("/image", verifyToken, verifyAdminRole, (req, res) => {
  let { img } = req.body;

  if (!(typeof img == "string")) {
    sendInvalidParamError(res);
    return;
  }

  let mime = getMimeTypeFromDataURI(img);
  let imgWithoutMime = img.replace(mime, "");
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "INSERT INTO image (img,prefix) VALUES (From_BASE64(?),?)",
      [imgWithoutMime, mime],
      (err, rows) => {
        connection.release();
        if (!err) {
          res.send(rows);
        } else {
          console.log(err);
          res.send(err);
        }
      }
    );
  });
});
app.delete("/image", verifyToken, verifyAdminRole, (req, res) => {
  let { id } = req.body;

  if (!(typeof id == "number")) {
    sendInvalidParamError(res);
    return;
  }
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query("DELETE FROM image WHERE id=?", [id], (err, rows) => {
      connection.release();
      if (!err) {
        res.send(rows);
      } else {
        res.send(err);
      }
    });
  });
});
app.get("/image", verifyToken, (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      `SELECT image.id, CONCAT(image.prefix,TO_BASE64(image.img)) FROM image`,
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
app.get("/image/:id", verifyToken, (req, res) => {
  let id = req.params.id;
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      `SELECT image.id,"img" FROM image
WHERE image.id=?`,
      [id],
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
app.put("/image", verifyToken, verifyAdminRole, (req, res) => {
  let { img, id } = req.body;

  if (!(typeof img == "string")) {
    sendInvalidParamError(res);
    return;
  }

  let mime = getMimeTypeFromDataURI(img);
  let imgWithoutMime = img.replace(mime, "");
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      `UPDATE image SET img=From_BASE64(?),prefix=? WHERE id=?`,
      [imgWithoutMime, mime, id],
      (err, rows) => {
        connection.release();
        if (!err) {
          res.send(rows);
        } else {
          console.log(err);
          res.send(err);
        }
      }
    );
  });
});

//actor_movie
app.post("/actor_movie", verifyToken, verifyAdminRole, (req, res) => {
  let { actor_id, movie_id } = req.body;

  if (!(typeof actor_id == "number") || !(typeof movie_id == "number")) {
    sendInvalidParamError(res);
    return;
  }
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "INSERT INTO actor_movie (actor_id,movie_id,merge_key) VALUES (?,?,gen_merge_key(?,?))",
      [actor_id, movie_id, actor_id, movie_id],
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
app.delete("/actor_movie", verifyToken, verifyAdminRole, (req, res) => {
  let { id } = req.body;

  if (!(typeof id == "number")) {
    sendInvalidParamError(res);
    return;
  }
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "DELETE FROM actor_movie WHERE id=?",
      [id],
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
app.get("/actor_movie", verifyToken, (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      `SELECT actor_movie.id ,concat(actor.firstname," ",actor.lastname) as "Actor", movie.name as "Movie Name" FROM actor_movie 
      JOIN actor ON actor_movie.actor_id=actor.id
      JOIN movie on actor_movie.movie_id=movie.id`,
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

//movie_genre
app.post("/movie_genre", verifyToken, verifyAdminRole, (req, res) => {
  let { genre_id, movie_id } = req.body;

  if (!(typeof genre_id == "number") || !(typeof movie_id == "number")) {
    sendInvalidParamError(res);
    return;
  }
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "INSERT INTO movie_genres (genre_id,movie_id,merge_key) VALUES (?,?,gen_merge_key(?,?))",
      [genre_id, movie_id, genre_id, movie_id],
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
app.delete("/movie_genre", verifyToken, verifyAdminRole, (req, res) => {
  let { id } = req.body;

  if (!(typeof id == "number")) {
    sendInvalidParamError(res);
    return;
  }
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "DELETE FROM movie_genres WHERE id=?",
      [id],
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
app.get("/movie_genre", verifyToken, (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      `SELECT movie_genres.id, movie.name as MovieName, genre.name FROM movie_genres 
      JOIN genre ON movie_genres.genre_id=genre.id
      JOIN movie ON movie_genres.movie_id=movie.id`,
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

app.get("/permissions", verifyToken, (req, res) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader == "undefined") {
    res.sendStatus(403);
  }
  const bearer = bearerHeader.split(" ");
  const bearerToken = bearer[1];
  req.token = bearerToken;
  let decodedToken = jwt.decode(req.token);

  pool.getConnection((err, connection) => {
    if (err) throw err;
    connection.query(
      "SELECT * FROM `user` WHERE `id`=?",
      [decodedToken.sub],
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
