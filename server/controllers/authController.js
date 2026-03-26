const User = require('../models/User'); // Import the User model
const bcrypt = require('bcryptjs');      // For password hashing - ENSURED THIS IS HERE
const jwt = require('jsonwebtoken');     // For creating JWT tokens
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client();

const createAuthResponse = (user, message) => ({
    message,
    user: {
        id: user.id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        roles: user.roles
    }
});

const sendAuthToken = (user, res, message, statusCode = 200) => {
    const payload = {
        user: {
            id: user.id,
            roles: user.roles
        }
    };

    jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: '1h' },
        (err, token) => {
            if (err) throw err;
            return res.status(statusCode).json({
                ...createAuthResponse(user, message),
                token
            });
        }
    );
};

const buildUniqueUsername = async (email, fullName) => {
    const rawBase = (fullName || email.split('@')[0] || 'user')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .slice(0, 16);

    const base = rawBase || 'user';
    let candidate = base;
    let suffix = 1;

    while (await User.findOne({ username: candidate })) {
        candidate = `${base}${suffix}`;
        suffix += 1;
    }

    return candidate;
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    const { fullName, username, email, password } = req.body;

    try {
        // 1. Check if user already exists with this email
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        // 2. Check if user already exists with this username
        user = await User.findOne({ username }); // Re-assign user variable
        if (user) {
            return res.status(400).json({ message: 'User with this username already exists' });
        }

        // 3. Hash the password
        const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
        const passwordHash = await bcrypt.hash(password, salt); // Hash the password

        // 4. Create new user
        user = new User({
            fullName,
            username,
            email,
            passwordHash, // Store the hashed password
            dateCreated: new Date(),
            roles: ['user'] // Default role
        });

        await user.save(); // Save the user to the database

        return sendAuthToken(user, res, 'User registered successfully', 201);

    } catch (error) {
        console.error('Error during user registration:', error.message);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // 1. Check if user exists
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 2. Compare password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // 3. Update lastLogin (optional)
        user.lastLogin = new Date();
        await user.save(); // Save the updated user

        return sendAuthToken(user, res, 'Logged in successfully');

    } catch (error) {
        console.error('Error during user login:', error.message);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// @desc    Change user's password
// @route   PUT /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => { // ADDED THIS FUNCTION
    const { currentPassword, newPassword } = req.body;

    try {
        // Find the user based on the ID from the authenticated token
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // 1. Check if the provided current password matches the stored hashed password
        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Current password is incorrect' });
        }

        // 2. Hash the new password before saving
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        user.lastLogin = new Date(); // Update last login as a side effect (optional, shows activity)

        await user.save(); // Save the user document with the new hashed password

        res.json({ message: 'Password changed successfully. Please log in again.' });

    } catch (error) {
        console.error('Error changing password:', error.message);
        res.status(500).json({ message: 'Server error during password change' });
    }
};

// @desc    Authenticate user with Google
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res) => {
    const { credential } = req.body;

    if (!credential) {
        return res.status(400).json({ message: 'Google credential is required' });
    }

    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
        return res.status(500).json({ message: 'Google login is not configured on server' });
    }

    let ticket;
    try {
        ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: googleClientId
        });
    } catch (error) {
        console.error('Google token verification failed:', error.message);
        return res.status(401).json({ message: 'Invalid Google credential' });
    }

    try {
        const payload = ticket.getPayload();
        if (!payload || !payload.email || !payload.email_verified) {
            return res.status(400).json({ message: 'Invalid Google account payload' });
        }

        const email = payload.email.toLowerCase();
        let user = await User.findOne({ email });

        if (!user) {
            const username = await buildUniqueUsername(email, payload.name);
            const passwordHash = await bcrypt.hash(`google_oauth_${Date.now()}`, 10);

            user = new User({
                fullName: payload.name || email.split('@')[0],
                username,
                email,
                passwordHash,
                dateCreated: new Date(),
                roles: ['user']
            });

            await user.save();
        }

        user.lastLogin = new Date();
        await user.save();

        return sendAuthToken(user, res, 'Logged in with Google successfully');
    } catch (error) {
        console.error('Error during Google login persistence:', error.message);
        return res.status(500).json({ message: 'Google login failed' });
    }
};