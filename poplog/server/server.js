// server/server.js
const express = require('express');
const connectDB = require('./config/db');

const app = express();
app.use(express.json());

connectDB();

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/items');

app.use('/auth', authRoutes);
app.use('/items', itemRoutes);

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
