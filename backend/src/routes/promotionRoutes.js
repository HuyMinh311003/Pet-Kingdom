const express = require('express');
const router = express.Router();
const promotionController = require('../controllers/promotionController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Public routes
router.post('/validate', promotionController.validatePromoCode);

// Admin only routes
router.post('/', [auth, admin], promotionController.createPromotion);
router.get('/', [auth, admin], promotionController.getPromotions);
router.get('/:id', [auth, admin], promotionController.getPromotionById);
router.put('/:id', [auth, admin], promotionController.updatePromotion);
router.delete('/:id', [auth, admin], promotionController.deletePromotion);
router.patch('/:id/toggle-status', [auth, admin], promotionController.toggleStatus);

module.exports = router;