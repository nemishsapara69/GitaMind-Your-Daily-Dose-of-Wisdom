const User = require('../models/User');

// @desc    Get logged in user profile
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-passwordHash'); // Exclude password hash
        if (user) {
            res.json({ success: true, data: user });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (user) {
            user.fullName = req.body.fullName || user.fullName;
            user.username = req.body.username || user.username;
            user.preferredLanguage = req.body.preferredLanguage || user.preferredLanguage;

            // Validate unique username if changed
            if (req.body.username && req.body.username !== user.username) {
                const usernameExists = await User.findOne({ username: req.body.username });
                if (usernameExists && usernameExists._id.toString() !== user._id.toString()) {
                    return res.status(400).json({ success: false, message: 'Username already taken' });
                }
            }

            const updatedUser = await user.save();
            res.json({
                success: true,
                data: {
                    id: updatedUser._id,
                    fullName: updatedUser.fullName,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    roles: updatedUser.roles,
                    preferredLanguage: updatedUser.preferredLanguage,
                    dateCreated: updatedUser.dateCreated
                }
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        console.error('Error updating user profile:', error.message);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        if (error.code === 11000) { // Duplicate key error
            return res.status(400).json({ success: false, message: `Duplicate field value: ${Object.keys(error.keyValue)[0]}` });
        }
        res.status(500).json({ success: false, message: 'Server error updating profile' });
    }
};