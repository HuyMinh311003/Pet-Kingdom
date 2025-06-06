const Cart = require("../models/Cart");
const Order = require("../models/Order");
const Product = require("../models/Product");
const ShippingConfig = require("../models/ShippingConfig");
const DiscountConfig = require("../models/DiscountConfig");

// GET /api/checkout - Lấy thông tin giỏ hàng + tính toán giá trị
const getCheckoutInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const subtotal = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // Get shipping fee from config
    const shippingConfig = await ShippingConfig.findOne().sort({
      updatedAt: -1,
    });
    const shipping = shippingConfig ? shippingConfig.shippingFee : 20000;

    // Calculate discount based on subtotal only
    const discountConfig = await DiscountConfig.findOne().sort({
      updatedAt: -1,
    });
    let discount = 0;

    if (
      discountConfig &&
      discountConfig.isActive &&
      discountConfig.tiers.length > 0
    ) {
      // Find applicable tier based on subtotal only
      const applicableTier = discountConfig.tiers
        .sort((a, b) => b.minSubtotal - a.minSubtotal) // Sort descending
        .find((tier) => subtotal >= tier.minSubtotal);

      if (applicableTier) {
        discount = (subtotal * applicableTier.discountPercentage) / 100;
      }
    }

    const total = subtotal - discount + shipping;

    res.json({
      success: true,
      cartItems: cart.items,
      subtotal,
      discount,
      shipping,
      total,
      user: {
        fullName: req.user.name,
        phone: req.user.phone,
        address: req.user.address,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error preparing checkout",
      error: error.message,
    });
  }
};

// POST /api/checkout - Tạo đơn hàng từ giỏ hàng
const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const subtotal = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    // Get shipping fee from config
    const shippingConfig = await ShippingConfig.findOne().sort({
      updatedAt: -1,
    });
    const shipping = shippingConfig ? shippingConfig.shippingFee : 20000;

    // Calculate discount based on subtotal only
    const discountConfig = await DiscountConfig.findOne().sort({
      updatedAt: -1,
    });
    let discount = 0;

    if (
      discountConfig &&
      discountConfig.isActive &&
      discountConfig.tiers.length > 0
    ) {
      // Find applicable tier based on subtotal only
      const applicableTier = discountConfig.tiers
        .sort((a, b) => b.minSubtotal - a.minSubtotal) // Sort descending
        .find((tier) => subtotal >= tier.minSubtotal);

      if (applicableTier) {
        discount = (subtotal * applicableTier.discountPercentage) / 100;
      }
    }

    const total = subtotal - discount + shipping;

    // Kiểm tra dữ liệu từ req.body
    const { shippingAddress, phone, paymentMethod, notes, promoCode,name } =
      req.body;

    if (!shippingAddress || !phone || !paymentMethod || !name) {
      return res.status(400).json({ message: "Missing required order info" });
    }

    // Tạo danh sách items cho đơn hàng
    const items = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const order = await Order.create({
      user: userId,
      items,
      subtotal,
      shippingFee: shipping,
      discount,
      total,
      shippingAddress,
      phone,
      name,
      paymentMethod,
      notes: notes || null,
      promoCode: promoCode || null,
      statusHistory: [
        {
          status: "Chờ xác nhận",
          date: new Date(),
          updatedBy: userId,
        },
      ],
    });

    // Cập nhật tồn kho
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product || product.stock < item.quantity) {
        return res.status(400);
      }
      product.stock -= item.quantity;

      await product.save();
    }

    // Xóa giỏ hàng sau khi đặt hàng
    await Cart.deleteOne({ user: userId });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error placing order",
      error: error.message,
    });
  }
};

module.exports = {
  getCheckoutInfo,
  placeOrder,
};
