const express = require('express');
const wishlistController = require('../controllers/wishlistController');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's wishlist
router.get('/:userId', auth, wishlistController.getWishlist);

// Add product to wishlist
router.post('/:userId/items', auth, wishlistController.addToWishlist);

// Remove product from wishlist
router.delete('/:userId/items/:productId', auth, wishlistController.removeFromWishlist);

// Check if product is in wishlist
router.get('/:userId/items/:productId', auth, wishlistController.checkWishlistItem);

// Clear wishlist
router.delete('/:userId', auth, wishlistController.clearWishlist);

module.exports = router; 