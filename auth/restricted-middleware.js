const bcrypt = require('bcryptjs');

// import token below 
const jwt = require("jsonwebtoken")
const secret = require("../config/secrets.js")
// import token above 

const Users = require('../users/users-model.js');

module.exports = (req, res, next) => {
  // const { username, password } = req.headers;
  const token = req.headers.authorization

  if(token) {
    // check that the token is valid 
    jwt.verify(token, secret.jwtSecret, (err, decodedToken => {
      if(err) {
        // foul play
        res.status(401).json({ message: "bad panda!" });
      } else {
        // token is good
        req.username = docodedToken.username 
        next()
      }
    }))
  } else {
    res.status(400).json({error: "No token provided"})
  }

  if (username && password) {
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
        res.status(500).json({ message: 'Ran into an unexpected error' });
      });
  } else {
    res.status(400).json({ message: 'No credentials provided' });
  }
};
