const User = require('../models/userModel');

exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.update(req.params.uid, req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    const users = await User.list();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};