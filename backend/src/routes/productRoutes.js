const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// POST /api/products
router.post('/', productController.createProduct);

// GET /api/products
router.get('/', productController.getProducts);

// GET /api/products/:id
router.get('/:id', productController.getProductById);

// GET /api/products/:id/related
router.get('/:id/related', productController.getRelatedProducts);

// PUT /api/products/:id
router.put('/:id', productController.updateProduct);

// DELETE /api/products/:id
router.delete('/:id', productController.deleteProduct);

// PATCH /api/products/:id/toggle-status
router.patch('/:id/toggle-status', productController.toggleStatus);

// PATCH /api/products/:id/stock
router.patch('/:id/stock', productController.updateStock);

module.exports = router;