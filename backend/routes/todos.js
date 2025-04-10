const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// Get all todos
router.get('/', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

// Add new todo
router.post('/', async (req, res) => {
  try {
    // Validate input
    if (!req.body.text) {
      return res.status(400).json({ message: "Text is required" });
    }

    const newTodo = new Todo({
      text: req.body.text,
      completed: false // Explicitly set default
    });
    
    const savedTodo = await newTodo.save();
    res.status(201).json(savedTodo);
    
  } catch (err) {
    console.error("Error saving todo:", err);
    res.status(500).json({ 
      message: "Server error",
      error: err.message // Send only the message in production
    });
  }
});



// Delete todo
router.delete('/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Todo deleted' });
});


//Backend route
router.patch('/:id', async (req, res) => {
    const todo = await Todo.findById(req.params.id);
    todo.completed = !todo.completed;
    await todo.save();
    res.json(todo);
  });


  
module.exports = router;