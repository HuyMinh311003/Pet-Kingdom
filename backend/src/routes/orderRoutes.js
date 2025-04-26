const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const shipper = require('../middleware/shipper');

// Customer routes
router.post('/', auth, orderController.createOrder);
router.get('/my-orders', auth, orderController.getUserOrders);

// Admin and shipper routes
router.get('/', [auth, admin], orderController.getOrders);
router.get('/analytics', [auth, admin], orderController.getOrderAnalytics);
router.get('/assigned', [auth, shipper], orderController.getOrdersByShipper);

// Shared routes (with role-based authorization in controller)
router.get('/:id', auth, orderController.getOrderById);
router.patch('/:id/status', auth, orderController.updateOrderStatus);

module.exports = router;