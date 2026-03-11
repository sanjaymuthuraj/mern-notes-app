const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const notesRoutes = require('./routes/notes');
const todosRoutes = require('./routes/todos');

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/todos', todosRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB runtime connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
