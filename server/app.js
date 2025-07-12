// server/app.js

const express = require('express');
const cors = require('cors');
const bugRoutes = require('./routes/bugRoutes');
const postRoutes = require('./routes/posts');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/bugs', bugRoutes);
app.use('/api/posts', postRoutes);
app.use(errorHandler);

module.exports = app;
