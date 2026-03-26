const mongoose = require('mongoose');

const favoriteVerseSchema = new mongoose.Schema({
    chapter_number: { type: Number, required: true },
    verse_number: { type: Number, required: true },
    dateAdded: { type: Date, default: Date.now }
}, { _id: false }); // Don't create an _id for subdocuments

const noteOnVerseSchema = new mongoose.Schema({
    chapter_number: { type: Number, required: true },
    verse_number: { type: Number, required: true },
    note: { type: String, required: true, trim: true },
    dateCreated: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now }
}, { _id: false });

const readProgressSchema = new mongoose.Schema({
    lastChapterRead: { type: Number, default: 0 },
    lastVerseRead: { type: Number, default: 0 },
    lastReadDate: { type: Date, default: Date.now }
}, { _id: false });

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address']
    },
    passwordHash: { // Store hashed password here
        type: String,
        required: [true, 'Password is required']
    },
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    lastLogin: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    roles: {
        type: [String], // Array of strings, e.g., ['user', 'admin']
        default: ['user'],
        enum: ['user', 'admin'] // Only these values are allowed
    },
    preferredLanguage: {
        type: String,
        default: 'english',
        enum: ['english', 'hindi', 'gujarati']
    },
    favoriteVerses: [favoriteVerseSchema],
    notesOnVerses: [noteOnVerseSchema],
    readProgress: readProgressSchema, // Embedded document
    passwordResetToken: String,
    passwordResetExpires: Date
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Virtual for user's id (helpful for frontend and consistency)
userSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtuals are included in toJSON and toObject
userSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        delete ret._id; // Remove _id from response
        delete ret.__v; // Remove __v from response
        delete ret.passwordHash; // Never send password hash to client
    }
});
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);