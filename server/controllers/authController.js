const User = require('../models/User'); // Import the User model
const bcrypt = require('bcryptjs');      // For password hashing - ENSURED THIS IS HERE
const jwt = require('jsonwebtoken');     // For creating JWT tokens

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

        // 5. Generate JWT token
        const payload = {
            user: {
                id: user.id, // Mongoose virtual 'id'
                roles: user.roles
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET, // Your secret from .env
            { expiresIn: '1h' },    // Token expires in 1 hour
            (err, token) => {
                if (err) throw err;
                res.status(201).json({
                    message: 'User registered successfully',
                    token,
                    user: {
                        id: user.id,
                        fullName: user.fullName,
                        username: user.username,
                        email: user.email,
                        roles: user.roles
                    }
                });
            }
        );

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

        // 4. Generate JWT token
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
                res.json({
                    message: 'Logged in successfully',
                    token,
                    user: {
                        id: user.id,
                        fullName: user.fullName,
                        username: user.username,
                        email: user.email,
                        roles: user.roles
                    }
                });
            }
        );

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