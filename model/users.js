// models/User.js

const mongoose = require('mongoose');

// Define User schema
const userSchema = new mongoose.Schema({
    u_name: { type: String, required: true },
    upwd: { type: Number, required: true },
    // Add other user fields as needed
});

// Create User model
const User = mongoose.model('User', userSchema);

module.exports = User;
