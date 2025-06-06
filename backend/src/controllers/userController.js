const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const fs = require('fs');
const path = require('path');

exports.updateAvatar = async (req, res) => {
    try {
        console.log('File received:', req.file);  // kiểm tra file upload

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        // Xoá avatar cũ nếu có
        if (user.avatar) {
            const oldPath = path.join(config.upload.path, user.avatar);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        // === ✅ CHỈNH PHẦN NÀY ===

        // Tính đường dẫn tương đối từ thư mục uploads (dùng path.relative)
        const relativePath = path.relative(
            path.join(__dirname, '..', config.upload.path), // gốc uploads
            req.file.path // đường dẫn tuyệt đối đến file vừa upload
        );

        // Gán lại avatar (chuyển \ -> / cho cross-platform)
        user.avatar = relativePath.replace(/\\/g, '/');

        // === ✅ END ===

        await user.save();

        res.json({
            success: true,
            message: 'Avatar updated successfully',
            data: { avatar: `/uploads/${user.avatar}` }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating avatar',
            error: error.message
        });
    }
};


exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            role: 'Customer' // Default role
        });

        await user.save();

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(201).json({
            success: true,
            data: {
                user,
                token
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error registering user',
            error: error.message
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.json({
            success: true,
            data: {
                user,
                token
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error logging in',
            error: error.message
        });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Only allow users to view their own profile unless admin
        if (req.user.role !== 'Admin' && req.user._id.toString() !== req.params.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this profile'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching profile',
            error: error.message
        });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const updates = req.body;

        // Don't allow role updates through this endpoint
        delete updates.role;
        delete updates.password;

        // Only allow users to update their own profile unless admin
        if (req.user.role !== 'Admin' && req.user._id.toString() !== req.params.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this profile'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        // Only allow users to change their own password unless admin
        if (req.user.role !== 'Admin' && req.user._id.toString() !== req.params.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to change this password'
            });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Verify current password
        if (req.user.role !== 'Admin') {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;

        await user.save();

        res.json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error changing password',
            error: error.message
        });
    }
};

exports.getUsers = async (req, res) => {
    try {
        const { role, search, page = 1, limit = 10 } = req.query;
        const query = {};

        if (role) query.role = role;
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const total = await User.countDocuments(query);

        const users = await User.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            success: true,
            data: {
                users,
                pagination: {
                    total,
                    page: Number(page),
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
};

exports.createStaff = async (req, res) => {
    try {
        const { name, email, password, phone, role } = req.body;

        // Validate role
        if (role !== 'Admin' && role !== 'Shipper') {
            return res.status(400).json({
                success: false,
                message: 'Invalid role specified'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'Email already registered'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create staff user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
            role
        });

        await user.save();

        res.status(201).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating staff account',
            error: error.message
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
};

exports.toggleStatus = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Prevent deactivating own account
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'Cannot deactivate your own account'
            });
        }

        user.isActive = !user.isActive;
        await user.save();

        res.json({
            success: true,
            data: {
                id: user._id,
                isActive: user.isActive
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error toggling user status',
            error: error.message
        });
    }
};
