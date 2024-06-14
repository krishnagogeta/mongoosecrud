// authRoutes.js

const express = require('express');
const router = express.Router();
const User = require('../model/users'); // Import the User model

// Route for user authentication
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username and password
        const user = await User.findOne({ username, password });

        if (user) {
            // Authentication successful
            res.json({ message: 'Authentication successful', user });
        } else {
            // Authentication failed
            res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (error) {
        console.error('Error during authentication:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
