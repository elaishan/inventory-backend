const connection = require('../dbconnection');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const SECRET_KEY = process.env.SECRET_KEY;

router.post('/', (req, res) => {
  const { username, password } = req.body;

  const query = `SELECT password, userprivilege FROM users WHERE username = ?`;
  connection.query(query, [username], (error, results) => {
    if (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'An error occurred during login' });
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    const user = results[0];
    const hashedPassword = user.password;
    const userprivilege = user.userprivilege;

    bcrypt.compare(password, hashedPassword, (compareError, isMatch) => {
      if (compareError) {
        console.error('Error comparing passwords:', compareError);
        res.status(500).json({ error: 'An error occurred during login' });
        return;
      }

      if (isMatch) {
        const token = jwt.sign({ username, userprivilege }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, userprivilege });
      } else {
        res.status(401).json({ message: 'Invalid password' });
      }
    });
  });
});

router.post('/verify-token', (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const { username, userprivilege } = decoded;
    res.json({ username, userprivilege });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;
