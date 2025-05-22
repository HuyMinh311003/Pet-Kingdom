const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const configController = require("../controllers/configController");

// Public routes
router.get("/shipping", configController.getShippingConfig);
router.get("/discount", configController.getDiscountConfig);

// Admin only routes
router.put("/shipping", [auth, admin], configController.updateShippingConfig);
router.put("/discount", [auth, admin], configController.updateDiscountConfig);
router.put(
  "/discount/toggle",
  [auth, admin],
  configController.toggleDiscountSystem
);

module.exports = router;
