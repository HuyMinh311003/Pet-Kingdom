const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');
require('dotenv').config();

// All cart routes require authentication
router.get('/:userId', auth, cartController.getCart);
router.post('/:userId/items', auth, cartController.addItem);
router.put('/:userId/items', auth, cartController.updateQuantity);
router.delete('/:userId/items', auth, cartController.removeItem);
module.exports = router;