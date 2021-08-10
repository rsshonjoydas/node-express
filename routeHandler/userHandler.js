const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const userSchema = require('../schemas/userSchema');
const User = new mongoose.model('User', userSchema);

// ! signup
router.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      name: req.body.name,
      username: req.body.username,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(200).json({
      message: 'Signup was successfully!',
    });
  } catch {
    res.status(500).json({
      message: 'Signup failed!',
    });
  }
});

// ! login
router.post('/login', async (req, res) => {
  try {
    const user = await User.find({ username: req.body.username });
    if (user && user.length > 0) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );
      if (isValidPassword) {
        const token = jwt.sign(
          {
            username: user[0].username,
            userId: user[0]._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: '1h',
          }
        );

        res.status(200).json({
          access_token: token,
          message: 'Login successful!',
        });
      } else {
        res.status(401).json({
          error: 'Authentication failed!',
        });
      }
    } else {
      res.status(401).json({
        error: 'Authentication failed!',
      });
    }
  } catch (error) {
    res.status(401).json({
      error: 'Authentication failed!',
    });
  }
});

module.exports = router;
