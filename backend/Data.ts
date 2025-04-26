import mongoose from "mongoose";

// ======== USER RELATED SCHEMAS ========

// 1. User Schema - Enhanced
const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  district: { type: String, required: true },
  city: { type: String, required: true },
  postalCode: { type: String },
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["Customer", "Admin", "Shipper"], required: true },
  addresses: [addressSchema],
  avatar: { type: String },
  usedDiscountCodes: [{ 
    code: { type: mongoose.Schema.Types.ObjectId, ref: "DiscountCode" },
    usedAt: { type: Date, default: Date.now }
  }],
  favoriteProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// ======== PRODUCT RELATED SCHEMAS ========

// 2. Category Schema - Enhanced for dynamic menu
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
  type: { type: String, enum: ["Pet", "Supply"], required: true },
  icon: { type: String }, // Icon for UI display
  displayOrder: { type: Number, default: 0 }, // For ordering in menu
  featuredImage: { type: String }, // For category banner
  metaTitle: { type: String }, // For SEO
  metaDescription: { type: String }, // For SEO
  isActive: { type: Boolean, default: true },
  isShowInMenu: { type: Boolean, default: true }, // Control menu visibility
}, { timestamps: true });

// 3. Product Image Schema - Separate for better management
const productImageSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  url: { type: String, required: true },
  alt: { type: String },
  isFeatured: { type: Boolean, default: false }, // Main product image
  displayOrder: { type: Number, default: 0 },
}, { timestamps: true });

// 4. Tag Schema - For product filtering and recommendations
const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
  type: { type: String, enum: ["Pet", "Supply", "Both"], default: "Both" },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// 5. Product Schema - Base schema with common properties
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  type: { type: String, enum: ["Pet", "Supply"], required: true },
  description: { type: String },
  shortDescription: { type: String },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tag" }],
  metaTitle: { type: String },
  metaDescription: { type: String },
  viewCount: { type: Number, default: 0 },
  purchaseCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true, discriminatorKey: 'itemType' });

// 6. Pet Schema - Extended from Product for pet-specific attributes
const petSchema = new mongoose.Schema({
  breed: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female"], required: true },
  age: { type: Number }, // In months
  weight: { type: Number },
  color: { type: String },
  birthday: { type: Date },
  isVaccinated: { type: Boolean, default: false },
  vaccinationDetails: { type: String },
  healthStatus: { type: String },
  temperament: { type: String },
  specialNeeds: { type: String },
  relatedSupplies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // Vật dụng liên quan
});

// 7. Supply Schema - Extended from Product for supply-specific attributes
const supplySchema = new mongoose.Schema({
  brand: { type: String },
  manufacturer: { type: String },
  quantity: { type: Number, required: true }, // Stock quantity
  weight: { type: Number },
  dimensions: {
    length: { type: Number },
    width: { type: Number },
    height: { type: Number },
    unit: { type: String, default: "cm" }
  },
  material: { type: String },
  ageRecommendation: { type: String },
  forPetTypes: [{ type: String }], // e.g., ["Dog", "Cat"]
  usageInstructions: { type: String },
  suitableFor: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }], // References to pet categories
});

// 8. Review Schema - For product reviews and ratings
const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" }, // Link to order for verified purchase
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: { type: String },
  comment: { type: String },
  images: [{ type: String }], // URLs of review images
  isVerifiedPurchase: { type: Boolean, default: false },
  helpfulCount: { type: Number, default: 0 }, // Number of users who found this review helpful
  isActive: { type: Boolean, default: true },
  adminResponse: { 
    comment: { type: String },
    respondedAt: { type: Date },
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  }
}, { timestamps: true });

// ======== ORDER RELATED SCHEMAS ========

// 9. Cart Schema - Enhanced
const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number }, // Cached price at the time of adding to cart
  addedAt: { type: Date, default: Date.now }
});

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [cartItemSchema],
  lastUpdated: { type: Date, default: Date.now }
}, { timestamps: true });

// 10. Order Status History Schema - For tracking order status changes
const orderStatusHistorySchema = new mongoose.Schema({
  status: { type: String, enum: ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"], required: true },
  note: { type: String },
  changedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  timestamp: { type: Date, default: Date.now }
});

// 11. Order Schema - Enhanced
const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  productSnapshot: {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    type: { type: String, enum: ["Pet", "Supply"], required: true },
    // Additional fields to store at time of purchase
    sku: { type: String },
    image: { type: String },
    attributes: { type: mongoose.Schema.Types.Mixed } // Store relevant attributes of pet or supply
  },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true }, // Price at time of purchase
  discount: { type: Number, default: 0 } // Individual item discount
});

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [orderItemSchema],
  subtotal: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  shippingFee: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  shippingInfo: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
    address: { type: String, required: true },
    district: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String },
    shippingNotes: { type: String }
  },
  billingInfo: {
    sameAsShipping: { type: Boolean, default: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    district: { type: String },
    city: { type: String },
    postalCode: { type: String }
  },
  paymentMethod: { 
    type: { type: String, enum: ["COD", "Bank", "EWallet"], required: true },
    details: { type: mongoose.Schema.Types.Mixed } // Store payment details if needed
  },
  paymentStatus: { type: String, enum: ["Pending", "Paid", "Failed", "Refunded"], default: "Pending" },
  transactionId: { type: String }, // For bank/ewallet transfers
  status: { type: String, enum: ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"], default: "Pending" },
  statusHistory: [orderStatusHistorySchema],
  discountCode: { type: mongoose.Schema.Types.ObjectId, ref: "DiscountCode" },
  shipper: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Assigned shipper
  estimatedDelivery: { type: Date },
  actualDelivery: { type: Date },
  shippingCarrier: { type: mongoose.Schema.Types.ObjectId, ref: "ShippingCarrier" },
  trackingNumber: { type: String },
  cancellationReason: { type: String },
  returnReason: { type: String },
  notes: { type: String }, // Internal notes
  customerNote: { type: String } // Customer visible notes
}, { timestamps: true });

// 12. Shipping Carrier Schema - For managing multiple shipping options
const shippingCarrierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String },
  contactInfo: { type: String },
  trackingUrlTemplate: { type: String }, // URL template with {trackingNumber} placeholder
  isActive: { type: Boolean, default: true },
  baseRate: { type: Number }, // Base shipping rate
  rateByCityDistrict: [{ 
    city: { type: String },
    district: { type: String },
    rate: { type: Number }
  }]
}, { timestamps: true });

// 13. Improved Discount Code Schema
const discountCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  type: { type: String, enum: ["Percentage", "Fixed", "FreeShipping", "Bundle"], required: true },
  value: { type: Number, required: true }, // Percentage or fixed amount
  minOrderValue: { type: Number, default: 0 }, // Minimum order value to apply
  maxDiscount: { type: Number }, // Maximum discount amount for percentage discounts
  quantity: { type: Number, required: true }, // Total available uses
  usedCount: { type: Number, default: 0 }, // Number of times used
  usesPerUser: { type: Number, default: 1 }, // Max uses per user
  validFrom: { type: Date, required: true },
  validTo: { type: Date, required: true },
  applicableProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }], // If empty, applies to all
  applicableCategories: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }], // If empty, applies to all
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// ======== STATISTICS & ANALYTICS SCHEMAS ========

// 14. Daily Statistics Schema - For analytics and reporting
const dailyStatisticsSchema = new mongoose.Schema({
  date: { type: Date, required: true, unique: true },
  sales: {
    totalOrders: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    petRevenue: { type: Number, default: 0 },
    supplyRevenue: { type: Number, default: 0 }
  },
  products: {
    topSellingPets: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      count: { type: Number },
      revenue: { type: Number }
    }],
    topSellingSupplies: [{
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      count: { type: Number },
      revenue: { type: Number }
    }]
  },
  customers: {
    newCustomers: { type: Number, default: 0 },
    returningCustomers: { type: Number, default: 0 }
  },
  expenses: {
    shippingCosts: { type: Number, default: 0 },
    marketingCosts: { type: Number, default: 0 },
    otherCosts: { type: Number, default: 0 }
  }
}, { timestamps: false });

// 15. Notification Schema - For user and admin notifications
const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ["Order", "Review", "System", "Promotion"], required: true },
  relatedId: { type: mongoose.Schema.Types.ObjectId }, // Reference to related entity (order, review, etc.)
  isRead: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false }
}, { timestamps: true });

// ======== MODEL CREATION ========

// Create base models
const User = mongoose.model("User", userSchema);
const Category = mongoose.model("Category", categorySchema);
const Tag = mongoose.model("Tag", tagSchema);
const ProductImage = mongoose.model("ProductImage", productImageSchema);
const Product = mongoose.model("Product", productSchema);
const Cart = mongoose.model("Cart", cartSchema);
const Order = mongoose.model("Order", orderSchema);
const Review = mongoose.model("Review", reviewSchema);
const DiscountCode = mongoose.model("DiscountCode", discountCodeSchema);
const ShippingCarrier = mongoose.model("ShippingCarrier", shippingCarrierSchema);
const DailyStatistics = mongoose.model("DailyStatistics", dailyStatisticsSchema);
const Notification = mongoose.model("Notification", notificationSchema);

// Create discriminator models for product types
const Pet = Product.discriminator("Pet", petSchema);
const Supply = Product.discriminator("Supply", supplySchema);

export {
  User,
  Category,
  Tag,
  ProductImage,
  Product,
  Pet,
  Supply,
  Cart,
  Order,
  Review,
  DiscountCode,
  ShippingCarrier,
  DailyStatistics,
  Notification
};