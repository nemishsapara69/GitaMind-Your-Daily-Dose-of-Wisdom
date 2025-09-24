const User = require('../models/user'); // Import the User model
const bcrypt = require('bcryptjs');      // For password hashing
const jwt = require('jsonwebtoken');     // For creating JWT tokens

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    const { fullName, username, email, password } = req.body;

    try {
        // 1. Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: 'User with this username already exists' });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10); // Generate a salt with 10 rounds
        const passwordHash = await bcrypt.hash(password, salt); // Hash the password

        // 3. Create new user
        user = new User({
            fullName,
            username,
            email,
            passwordHash, // Store the hashed password
            dateCreated: new Date(),
            roles: ['user'] // Default role
        });

        await user.save(); // Save the user to the database

        // 4. Generate JWT token
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