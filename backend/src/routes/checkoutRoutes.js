const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const checkoutController = require('../controllers/checkoutController');

router.get('/', auth, checkoutController.getCheckoutInfo);
router.post('/', auth, checkoutController.placeOrder);

module.exports = router;
