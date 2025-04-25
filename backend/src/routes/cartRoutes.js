const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

// GET /api/cart/:userId
router.get('/:userId', cartController.getCart);

// POST /api/cart/:userId/items
router.post('/:userId/items', cartController.addItem);

// PATCH /api/cart/:userId/items
router.patch('/:userId/items', cartController.updateQuantity);

// DELETE /api/cart/:userId/items
router.delete('/:userId/items', cartController.removeItem);

// DELETE /api/cart/:userId
router.delete('/:userId', cartController.clearCart);

module.exports = router;