const mongoose = require("mongoose");

const shippingConfigSchema = new mongoose.Schema({
  shippingFee: {
    type: Number,
    required: true,
    default: 20000,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
});

module.exports = mongoose.model("ShippingConfig", shippingConfigSchema);
