const bcrypt = require('bcryptjs');
const User = require('../models/User');
const config = require('./config');

const initializeAdmin = async () => {
    try {
        // Check if admin user exists
        const adminExists = await User.findOne({ email: config.admin.email });

        if (!adminExists) {
            // Create default admin user
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(config.admin.password, salt);

            const admin = new User({
                name: config.admin.name,
                email: config.admin.email,
                password: hashedPassword,
                phone: '0000000000', // Default phone number
                role: 'Admin',
                isActive: true
            });

            await admin.save();
            console.log('Default admin user created successfully');
        }
    } catch (error) {
        console.error('Error initializing admin user:', error);
        throw error;
    }
};

module.exports = {
    initializeAdmin
};