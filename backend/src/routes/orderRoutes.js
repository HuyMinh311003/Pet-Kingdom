const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const shipper = require("../middleware/shipper");

// Customer routes
router.get("/customer-orders", auth, orderController.getUserOrders);

// Admin routes
router.get("/", [auth, admin], orderController.getOrders);
router.get("/analytics", [auth, admin], orderController.getOrderAnalytics);
router.put(
  "/:id/assign-shipper",
  [auth, admin],
  orderController.adminAssignShipper
);

// Shipper routes
router.get(
  "/assigned-orders",
  [auth, shipper],
  orderController.getAssignedOrders
);
router.get(
  "/shipper-orders",
  [auth, shipper],
  orderController.getShipperOrders
);
router.put(
  "/assign/:id",
  [auth, shipper],
  orderController.assignOrderToShipper
);

// Shared routes (with role-based authorization in controller)
router.get("/:id", auth, orderController.getOrderById);
router.patch("/:id/status", auth, orderController.updateOrderStatus);

module.exports = router;
