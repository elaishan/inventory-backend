const connection = require('../dbconnection');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;
const verifyToken = require("../middleware/verifyToken");

router.post('/', (req, res) => {
  const { username, password } = req.body; // Destructure username and password from req.body
  
  const query = `SELECT password FROM users WHERE username = ?`; // Use placeholders
  connection.query(query, [username], (error, results) => { // Pass username as an array in the query
    if (error) {
      console.error('Error fetching user:', error);
      return;
    } else if (results.length === 0) {
      console.log('User not found.');
      return;
    } else {
      const user = results[0];
      const hashedPassword = user.password;

      bcrypt.compare(password, hashedPassword, (compareError, isMatch) => {
        if (compareError) {
          console.error('Error comparing passwords:', compareError);
          return;
        }

        if (isMatch) {
          console.log('Password match! User authenticated.');
          const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' }); // Remove password from the token payload
          res.json({ token });
          // Proceed with further actions for authenticated users
        } else {
          console.log('Authentication Failed!');
          // Handle incorrect password scenario
        }
      });
    }
  });
});

router.get('/protected', verifyToken, (req, res) => {
  // Access user information from `req.user`
  // Handle the protected route logic
});

module.exports = router;
