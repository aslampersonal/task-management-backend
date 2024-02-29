const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require("../config");

const signup = async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) throw new Error('User not found');

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) throw new Error('Invalid credentials');

    const token = jwt.sign({ userId: user._id }, config.secretKey, { expiresIn: '4h' });
    res.status(200).json({ token, userId: user._id, username: user.username });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// get users details
const getUsers = async (req, res) => {
  try {
    const allUsers = await User.find({ email: {$ne: "admin@gmail.com"} }, {});
    res.status(200).json({ users: allUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { signup, login, getUsers };
