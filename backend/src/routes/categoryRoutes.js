const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// POST /api/categories
router.post('/', categoryController.createCategory);

// GET /api/categories
router.get('/', categoryController.getCategories);

// GET /api/categories/:id
router.get('/:id', categoryController.getCategoryById);

// PUT /api/categories/:id
router.put('/:id', categoryController.updateCategory);

// DELETE /api/categories/:id
router.delete('/:id', categoryController.deleteCategory);

// PATCH /api/categories/:id/toggle-status
router.patch('/:id/toggle-status', categoryController.toggleStatus);

module.exports = router;