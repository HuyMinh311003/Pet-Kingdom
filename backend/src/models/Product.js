const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['pet', 'accessory'],
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  images: [{
    type: String,
    required: true
  }],
  stock: {
    type: Number,
    required: true,
    min: 0
  },
  // Pet-specific fields
  breed: {
    type: String,
    required: function() { return this.type === 'pet'; }
  },
  age: {
    type: Number,
    required: function() { return this.type === 'pet'; }
  },
  gender: {
    type: String,
    enum: ['male', 'female'],
    required: function() { return this.type === 'pet'; }
  },
  // Accessory-specific fields
  brand: {
    type: String,
    required: function() { return this.type === 'accessory'; }
  },
  specifications: {
    type: Map,
    of: String
  },
  // Common fields
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  salePrice: {
    type: Number,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: Date
});

// Add indexes for common queries
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ type: 1, category: 1 });
productSchema.index({ isOnSale: 1 });

const Product = mongoose.model('Product', productSchema);
module.exports = Product;