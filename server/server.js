require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Import routes
const chapterRoutes = require('./routes/chapterRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');
const searchRoutes = require('./routes/searchRoutes');
const moodVerseRoutes = require('./routes/moodVerseRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const userPreferencesRoutes = require('./routes/userPreferencesRoutes');

// Import Daily Verse Scheduler
const { startDailyVerseScheduler } = require('./utils/dailyVerseScheduler');

const app = express();
const PORT = process.env.PORT || 5000;

const corsOptions = {
    // Reflect request origin to avoid deployment/env origin mismatch issues.
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false
};

// Middleware
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

// --- Database Connection ---
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
    console.error('Missing MongoDB connection string. Set MONGODB_URI (or MONGO_URI) in server/.env');
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB Atlas!');
        // Start daily verse scheduler after DB connection
        startDailyVerseScheduler();
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
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/mood-verses', moodVerseRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/preferences', userPreferencesRoutes);

// --- Start the Server ---
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});