const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST /api/orders
router.post('/', orderController.createOrder);

// GET /api/orders
router.get('/', orderController.getOrders);

// GET /api/orders/:id
router.get('/:id', orderController.getOrderById);

// GET /api/orders/user/:userId
router.get('/user/:userId', orderController.getUserOrders);

// PATCH /api/orders/:id/status
router.patch('/:id/status', orderController.updateOrderStatus);

// GET /api/orders/analytics
router.get('/analytics', orderController.getOrderAnalytics);

module.exports = router;