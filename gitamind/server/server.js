require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const chapterRoutes = require('./routes/chapterRoutes');
const authRoutes = require('./routes/authRoutes'); 
const categoryRoutes = require('./routes/categoryRoutes'); // Add this line// 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Database Connection ---
const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas!');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    });

// --- Basic Route ---
app.get('/', (req, res) => {
    res.send('Welcome to Gitamind API!');
});

// --- API Routes ---
app.use('/api/chapters', chapterRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes); // ADDED

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});