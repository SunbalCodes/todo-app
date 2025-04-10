const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Todo', TodoSchema);