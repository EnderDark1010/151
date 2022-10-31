function isAdmin(adminPassword) {
  console.log(adminPassword);
  return adminPassword === "1234";
}

function sendIsNotAdminError(res) {
  res.status(401).json({ message: "You are not an Admin" });
}

function sendInvalidParamError(res) {
  res.status(401).json({ message: "Invalid Paramters" });
}

function verifyToken(req, res, next) {
  //Auth header value = > send token into header

  const bearerHeader = req.headers["authorization"];
  //check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    //split the space at the bearer
    const bearer = bearerHeader.split(" ");
    //Get token from string
    const bearerToken = bearer[1];

    //set the token
    req.token = bearerToken;

    //next middleweare
    next();
  } else {
    //Fobidden
    res.sendStatus(403);
  }
}

module.exports = {
  isAdmin,
  verifyToken,
  sendInvalidParamError,
  sendIsNotAdminError,
};
