require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');

//MongoDB Connect and Err HandleR
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected!"))
  .catch(err => console.error(err));

  mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 5000
  })
  .then(() => console.log("MongoDB connected successfully!"))
  .catch(err => console.error("MongoDB connection error:", err));


// Enable compression
const compression = require('compression');
app.use(compression());

// Add timeout middleware
app.use((req, res, next) => {
  res.setTimeout(5000, () => { // 5 second timeout
    res.status(503).json({ error: 'Service timeout' });
  });
  next();
});


// Middleware
app.use(express.json()); 

// Test Route
app.get('/', (req, res) => {
  res.send('Todo API Working!');
});

//
const cors = require('cors');

// Enable CORS before routes
app.use(cors({
  origin: 'http://localhost:3000', // React app's URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));


// Start Server
const todosRouter = require('./routes/todos');
app.use('/api/todos', todosRouter);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));