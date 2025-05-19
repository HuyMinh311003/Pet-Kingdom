const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Product = require('../models/Product');

// GET /api/checkout - Lấy thông tin giỏ hàng + tính toán giá trị
const getCheckoutInfo = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    const subtotal = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    const discount = 0; // Có thể xử lý promoCode sau
    const shipping = 20000; // Tùy quy định
    const total = subtotal - discount + shipping;

    res.json({
      success: true,
      cartItems: cart.items,
      subtotal,
      discount,
      shipping,
      total,
      user: {
        fullName: req.user.fullName,
        phone: req.user.phone,
        address: req.user.address
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error preparing checkout',
      error: error.message
    });
  }
};

// POST /api/checkout - Tạo đơn hàng từ giỏ hàng
// POST /api/checkout - Tạo đơn hàng từ giỏ hàng
const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    const subtotal = cart.items.reduce((sum, item) => {
      return sum + item.product.price * item.quantity;
    }, 0);

    const discount = 0;
    const shippingFee = 20000;
    const total = subtotal - discount + shippingFee;

    // Kiểm tra dữ liệu từ req.body
    const {
      shippingAddress,
      phone,
      paymentMethod,
      notes,
      promoCode
    } = req.body;

    if (!shippingAddress || !phone || !paymentMethod) {
      return res.status(400).json({ message: 'Missing required order info' });
    }

    // Tạo danh sách items cho đơn hàng
    const items = cart.items.map(item => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const order = await Order.create({
      user: userId,
      items,
      subtotal,
      shippingFee,
      discount,
      total,
      shippingAddress,
      phone,
      paymentMethod,
      notes: notes || null,
      promoCode: promoCode || null,
      statusHistory: [{
        status: 'Chờ xác nhận',
        date: new Date(),
        updatedBy: userId
      }]
    });

    // Cập nhật tồn kho
    for (const item of cart.items) {
      const product = await Product.findById(item.product._id);
      if (!product || product.quantity < item.quantity) {
        return res.status(400).json({
          message: `Not enough stock for ${product?.name || 'a product'}`
        });
      }
      product.quantity -= item.quantity;
      await product.save();
    }

    // Xóa giỏ hàng sau khi đặt hàng
    await Cart.deleteOne({ user: userId });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error placing order',
      error: error.message
    });
  }
};

module.exports = {
  getCheckoutInfo,
  placeOrder
};
