const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Public routes
router.get('/', productController.getProducts);
router.get('/:id', productController.getProductById);
router.get('/:id/related', productController.getRelatedProducts);

// Admin only routes
router.post('/', [auth, admin], productController.createProduct);
router.put('/:id', [auth, admin], productController.updateProduct);
router.delete('/:id', [auth, admin], productController.deleteProduct);
router.patch('/:id/toggle-status', [auth, admin], productController.toggleStatus);
router.patch('/:id/stock', [auth, admin], productController.updateStock);

module.exports = router;