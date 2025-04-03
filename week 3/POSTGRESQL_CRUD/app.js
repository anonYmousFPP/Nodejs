const express = require('express');
const app = express();
const apiRouter = require('./routes/api');
const errorHandler = require('./middlewares/errorHandler');

// Middleware
app.use(express.json());

// Routes
app.use('/api', apiRouter);

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});