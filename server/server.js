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

// --- Validate Required Environment Variables ---
const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'GOOGLE_CLIENT_ID'];
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar] && envVar !== 'MONGODB_URI');

// MongoDB URI can also be MONGO_URI
const MONGODB_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

if (!MONGODB_URI) {
    console.error('❌ CRITICAL: Missing MONGODB_URI or MONGO_URI environment variable');
    console.error('   - Set MONGODB_URI in your environment variables');
    console.error('   - Local example: mongodb://localhost:27017/gitamind');
    console.error('   - Atlas example: mongodb+srv://username:password@cluster.mongodb.net/gitamind');
} else {
    try {
        const [beforeAt, afterAt] = MONGODB_URI.split('@');
        const safeUriInfo = afterAt || MONGODB_URI;
        console.log('ℹ️ Using MongoDB connection (host/db):', safeUriInfo);
    } catch {
        console.log('ℹ️ Using MongoDB connection string');
    }
}

if (!process.env.JWT_SECRET) {
    console.error('❌ CRITICAL: Missing JWT_SECRET environment variable');
}

if (!process.env.GOOGLE_CLIENT_ID) {
    console.warn('⚠️  WARNING: GOOGLE_CLIENT_ID not set - Google login will not work');
}

const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            'http://localhost:3000',
            'http://localhost:5173',
            'https://gita-mind-your-daily-dose-of-wisdom.vercel.app',
            'https://gitamind-api.onrender.com'
        ];
        
        // Allow requests with no origin (like mobile apps or Postman)
        if (!origin) {
            return callback(null, true);
        }

        try {
            const hostname = new URL(origin).hostname;
            const isKnownOrigin = allowedOrigins.indexOf(origin) !== -1;
            const isVercelApp = hostname.endsWith('vercel.app');

            if (isKnownOrigin || isVercelApp) {
                return callback(null, true);
            }
        } catch (e) {
            console.log('CORS origin parse error, origin:', origin, 'error:', e.message);
        }

        console.log('Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// --- Database Connection ---
if (!MONGODB_URI) {
    console.error('❌ Cannot start server: MONGODB_URI is not set');
    console.error('   On Render: Add MONGODB_URI to Environment Variables');
    process.exit(1);
}

console.log('🔄 Attempting to connect to MongoDB...');
mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
})
    .then(() => {
        console.log('✅ Connected to MongoDB Atlas!');
        // Start daily verse scheduler ONLY after DB is connected
        try {
            startDailyVerseScheduler();
            console.log('✅ Daily verse scheduler started');
        } catch (error) {
            console.warn('⚠️  Failed to start daily verse scheduler:', error.message);
            // Continue running even if scheduler fails
        }
    })
    .catch((error) => {
        console.error('❌ MongoDB connection error:', error.message);
        console.error('   Check your MONGODB_URI environment variable');
        // Don't exit immediately - allow server to run and show error page
    });

// --- Wait a bit before starting server to ensure DB connection attempt ---
setTimeout(() => {
    console.log('Starting API server...');
}, 1000);

// --- Basic Route ---
app.get('/', (req, res) => {
    res.send('Welcome to Gitamind API!');
});

// --- Health Check Endpoint ---
app.get('/health', (req, res) => {
    const mongoStatus = mongoose.connection.readyState; // 0=disconnected, 1=connected, 2=connecting, 3=disconnecting
    const statusMap = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
    };
    
    res.status(mongoStatus === 1 ? 200 : 503).json({
        status: mongoStatus === 1 ? 'OK' : 'DATABASE_DISCONNECTED',
        mongodb: statusMap[mongoStatus],
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
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

// --- Global Error Handler Middleware (MUST be last) ---
app.use((err, req, res, next) => {
    console.error('🔴 Unhandled Error:', err.message);
    console.error(err.stack);
    res.status(500).json({ 
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Server error'
    });
});

// --- Start the Server ---
const server = app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
});

// Handle server errors
server.on('error', (error) => {
    console.error('❌ Server error:', error.message);
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use`);
    }
});