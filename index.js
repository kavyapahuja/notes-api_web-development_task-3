const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const notesRoute = require('./routes/notes');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/notes', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(function () {
  console.log(' Connected to MongoDB');
})
.catch(function (err) {
  console.error(' MongoDB connection error:', err);
});

// Body parser middleware
app.use(bodyParser.json());

// Debug middleware - Add this to see all incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Body:`, req.body);
  next();
});

// Root route
app.get('/', function (req, res) {
  res.send('Welcome to the Notes API!');
});

// Notes routes
app.use('/api/notes', notesRoute);

// Start server
app.listen(PORT, function () {
  console.log(` Server running on port ${PORT}`);
});