const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Public routes
router.get('/product/:productId', reviewController.getProductReviews);

// Authenticated routes
router.post('/', auth, reviewController.createReview);
router.get('/user/:userId', auth, reviewController.getUserReviews);
router.put('/:id', auth, reviewController.updateReview);
router.delete('/:id', auth, reviewController.deleteReview);

// Admin only routes
router.patch('/:id/verify', [auth, admin], reviewController.verifyReview);

module.exports = router;