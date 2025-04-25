const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');

// POST /api/promotions
router.post('/', promotionController.createPromotion);

// GET /api/promotions
router.get('/', promotionController.getPromotions);

// GET /api/promotions/:id
router.get('/:id', promotionController.getPromotionById);

// PUT /api/promotions/:id
router.put('/:id', promotionController.updatePromotion);

// DELETE /api/promotions/:id
router.delete('/:id', promotionController.deletePromotion);

// POST /api/promotions/validate
router.post('/validate', promotionController.validatePromotion);

// PATCH /api/promotions/:id/toggle-status
router.patch('/:id/toggle-status', promotionController.toggleStatus);

module.exports = router;