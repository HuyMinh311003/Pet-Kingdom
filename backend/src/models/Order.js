const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity must be at least 1"],
        },
        price: {
          type: Number,
          required: true,
          min: [0, "Price cannot be negative"],
        },
      },
    ],
    subtotal: {
      type: Number,
      required: true,
      min: [0, "Subtotal cannot be negative"],
    },
    shippingFee: {
      type: Number,
      required: true,
      min: [0, "Shipping fee cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },
    total: {
      type: Number,
      required: true,
      min: [0, "Total cannot be negative"],
    },
    shippingAddress: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v);
        },
        message: "Invalid phone number format",
      },
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Bank Transfer"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Chờ xác nhận", "Đã xác nhận", "Đang giao", "Đã giao", "Đã hủy"],
      default: "Chờ xác nhận",
    },
    statusHistory: [
      {
        status: {
          type: String,
          enum: [
            "Chờ xác nhận",
            "Đã xác nhận",
            "Đang giao",
            "Đã giao",
            "Đã hủy",
          ],
          required: true,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        note: String,
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    promoCode: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Add indices for common queries
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ assignedTo: 1, status: 1 });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
