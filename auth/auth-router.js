const router = require('express').Router();
const bcrypt = require('bcryptjs');
// import token below
const token = require("jsonwebtoken")
// import token above 

const Users = require('../users/users-model.js');

// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      // produce token 
      const token = generateToken(user)

      // add token to response 
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({
          message: `Welcome ${user.username}!`, 
          token,
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

// token function 
function generateToken(user) {
  const payload = {
    username: user.username, // tokens username 
    subject: user.id // token id
  }
  const secret = "is it secret? is it safe?"
  const option = {
    expiresIn: "5d" // the amount of time it takes a token to expire 
  }

  return jwt.sign(payload, secret, option)
}




module.exports = router;
