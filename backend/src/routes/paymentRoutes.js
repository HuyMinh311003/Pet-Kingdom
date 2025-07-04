const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/paymentController');

router.post('/zalo-qr', auth, ctrl.createZaloOrder);
router.post('/zalo-callback', ctrl.zaloCallback);

module.exports = router;
