// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');
const { errorHandler } = require('./middleware/errorMiddleware');
const authRouter = require('./routes/auth');
const todosRouter = require('./routes/todos');

const app = express();

//------------------------------------------------------------------------------
// URL Validation Middleware
// This middleware checks that the incoming request URL is valid (i.e. it must
// be a relative URL starting with a slash). This prevents accidental or malicious
// requests with a full URL (e.g. "https://git.new/pathToRegexpError") from reaching
// the Express router and causing path-to-regexp to fail.
//------------------------------------------------------------------------------
app.use((req, res, next) => {
  // Log the incoming URL for debugging
  console.log("Incoming request URL:", req.originalUrl);

  // If the URL does not start with '/', reject it.
  if (!req.originalUrl.startsWith('/')) {
    console.error("Rejected URL not starting with /:", req.originalUrl);
    return res.status(400).json({ success: false, error: 'Invalid URL format: must start with "/"' });
  }
  
  // Additionally, if the URL contains a protocol indicator (e.g., "http://" or "https://")
  // anywhere in the URL string, reject it.
  if (req.originalUrl.includes('://')) {
    console.error("Rejected absolute URL:", req.originalUrl);
    return res.status(400).json({ success: false, error: 'Invalid URL format: absolute URL not allowed' });
  }
  
  next();
});

//------------------------------------------------------------------------------
// The rest of your middleware and routes follow below...
//------------------------------------------------------------------------------

// Database Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000
    });
    console.log('MongoDB connected successfully!');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};
connectDB();

// Security Middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api', limiter);

// Body Parsing
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRouter);
app.use('/api/todos', todosRouter);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    dbStatus: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error Handling
app.use(errorHandler);

// 404 Handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Server Configuration
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

module.exports = server;
