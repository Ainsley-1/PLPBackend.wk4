require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

// Import routes
const productRoutes = require('./routes/products');

// Import middleware
const { errorHandler } = require('./utils/errorHandler');
const logger = require('./middleware/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// Built-in middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom logging middleware
app.use(logger);

// HTTP request logging - more detailed in development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Routes
app.use('/api/products', productRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist`
  });
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api/products`);
});

module.exports = app;