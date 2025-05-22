const mongoose = require("mongoose");

const discountTierSchema = new mongoose.Schema({
  minSubtotal: {
    type: Number,
    required: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
});

const discountConfigSchema = new mongoose.Schema({
  tiers: [discountTierSchema],
  isActive: {
    type: Boolean,
    default: true,
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

module.exports = mongoose.model("DiscountConfig", discountConfigSchema);
