const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Text is required'],  // Moved inside text field definition
    trim: true  // Optional: removes whitespace
  },
  completed: { 
    type: Boolean, 
    default: false 
  }
}, { timestamps: true });

module.exports = mongoose.model('Todo', TodoSchema);