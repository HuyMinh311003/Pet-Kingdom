const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');
const verifyCaptcha = require('../middleware/verifyCaptcha');
require('dotenv').config();
const rateLimit = require('express-rate-limit');

const petLimiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS),
    max: parseInt(process.env.RATE_LIMIT_MAX),
    message: 'Bạn thực hiện quá nhiều lần giữ hàng, vui lòng thử lại sau.',
    standardHeaders: true,
    legacyHeaders: false,
});
// All cart routes require authentication
router.get('/:userId', auth, cartController.getCart);
router.post('/:userId/items', auth, cartController.addItem, verifyCaptcha, petLimiter);
router.put('/:userId/items', auth, cartController.updateQuantity);
router.delete('/:userId/items', auth, cartController.removeItem);
router.delete('/:userId', auth, cartController.clearCart);

module.exports = router;