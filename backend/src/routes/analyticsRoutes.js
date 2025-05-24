const express = require('express');
const router = express.Router();
const analyticsCtrl = require('../controllers/analyticsController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/sales', [auth, admin], analyticsCtrl.getSalesOverview);
router.get('/category-sales', [auth, admin], analyticsCtrl.getCategorySales);
router.get('/delivery-costs', [auth, admin], analyticsCtrl.getDeliveryCosts);

module.exports = router;
