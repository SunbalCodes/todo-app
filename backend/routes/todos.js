const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');
const { protect } = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');

// Input validation rules
const todoValidation = [
  body('text')
    .trim()
    .notEmpty().withMessage('Text is required')
    .isLength({ max: 200 }).withMessage('Todo cannot exceed 200 characters')
];

// Get all todos for authenticated user
router.get('/', protect, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id })
                         .sort({ createdAt: -1 }); // Newest first
    res.json({
      success: true,
      count: todos.length,
      data: todos
    });
  } catch (err) {
    console.error('Get todos error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error fetching todos'
    });
  }
});

// Create new todo
router.post('/', protect, todoValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  try {
    const todo = await Todo.create({
      text: req.body.text,
      user: req.user.id
    });

    res.status(201).json({
      success: true,
      data: todo
    });
  } catch (err) {
    console.error('Create todo error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error creating todo'
    });
  }
});

// Update todo completion status
router.patch('/:id', protect, async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { completed: req.body.completed },
      { new: true, runValidators: true }
    );

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    res.json({
      success: true,
      data: todo
    });
  } catch (err) {
    console.error('Update todo error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error updating todo'
    });
  }
});

// Delete todo
router.delete('/:id', protect, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: 'Todo not found'
      });
    }

    res.json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error('Delete todo error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error deleting todo'
    });
  }
});

module.exports = router;