const Task = require('../models/Task');
const jwt = require('jsonwebtoken');
const config = require("../config");
const mongoose = require('mongoose'); 

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }
    const decodedToken = jwt.verify(token, config.secretKey);
    console.log(decodedToken);
    const userId = decodedToken.userId;
    const task = new Task({ title, description, dueDate, user: userId });
    await task.save();
    res.status(201).json({ message: 'Task created successfully' });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    const token = req.headers.authorization?.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }
    const decodedToken = jwt.verify(token, config.secretKey);
    const userId = new mongoose.Types.ObjectId(decodedToken.userId);
    const fullTasks = await Task.find();
    const tasks = fullTasks.filter(task => task.user.equals(userId));
    console.log(tasks);
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { title, description, dueDate, completed } = req.body;
    await Task.findByIdAndUpdate(taskId, { title, description, dueDate, completed });
    res.status(200).json({ message: 'Task updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    await Task.findByIdAndDelete(taskId);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createTask, getTasks, updateTask, deleteTask };
