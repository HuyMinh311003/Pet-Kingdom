const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// POST /api/reviews
router.post('/', reviewController.createReview);

// GET /api/reviews/product/:productId
router.get('/product/:productId', reviewController.getProductReviews);

// GET /api/reviews/user/:userId
router.get('/user/:userId', reviewController.getUserReviews);

// GET /api/reviews/stats/:productId
router.get('/stats/:productId', reviewController.getReviewStats);

// PUT /api/reviews/:id
router.put('/:id', reviewController.updateReview);

// DELETE /api/reviews/:id
router.delete('/:id', reviewController.deleteReview);

module.exports = router;