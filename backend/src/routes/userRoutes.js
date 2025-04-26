const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Authenticated routes
router.get('/profile/:id', auth, userController.getProfile);
router.put('/profile/:id', auth, userController.updateProfile);
router.put('/profile/:id/password', auth, userController.changePassword);

// Admin only routes - Chaining middleware functions correctly
router.get('/', [auth, admin], userController.getUsers);
router.post('/staff', [auth, admin], userController.createStaff);
router.patch('/:id/toggle-status', [auth, admin], userController.toggleStatus);

module.exports = router;