const connection = require('../dbconnection');
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;


router.post('/', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  connection.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, result) => {
      if (err) {
        res.status(500).json({ error: 'An error occurred during login' });
      } else {
        if (result.length > 0) {

          // Generate a JWT token
          const token = jwt.sign({ username, password }, SECRET_KEY, { expiresIn: '1h' });

          res.json({ token });
        } else {
          res.status(401).json({ message: 'Authentication failed' });
        }
      }
    }
  );
});

module.exports = router;
