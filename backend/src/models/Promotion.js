const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Promotion code is required'],
        unique: true,
        uppercase: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: [true, 'Promotion type is required']
    },
    value: {
        type: Number,
        required: [true, 'Promotion value is required'],
        min: [0, 'Value cannot be negative']
    },
    startDate: {
        type: Date,
        required: [true, 'Start date is required']
    },
    endDate: {
        type: Date,
        required: [true, 'End date is required']
    },
    minOrderValue: {
        type: Number,
        default: 0,
        min: [0, 'Minimum order value cannot be negative']
    },
    maxDiscount: {
        type: Number,
        default: null
    },
    usageLimit: {
        type: Number,
        default: null
    },
    usageCount: {
        type: Number,
        default: 0
    },
    productType: {
        type: String,
        enum: ['all', 'pet', 'tool'],
        default: 'all'
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    description: String
}, {
    timestamps: true
});

// Add index for searching
promotionSchema.index({ code: 1 });
promotionSchema.index({ startDate: 1, endDate: 1 });
promotionSchema.index({ isActive: 1 });

// Method to check if promotion is valid
promotionSchema.methods.isValid = function(orderValue, productType = null) {
    const now = new Date();
    
    // Check if promotion is active and within date range
    if (!this.isActive || now < this.startDate || now > this.endDate) {
        return false;
    }

    // Check usage limit
    if (this.usageLimit && this.usageCount >= this.usageLimit) {
        return false;
    }

    // Check minimum order value
    if (orderValue < this.minOrderValue) {
        return false;
    }

    // Check product type restriction
    if (productType && this.productType !== 'all' && this.productType !== productType) {
        return false;
    }

    return true;
};

// Method to calculate discount amount
promotionSchema.methods.calculateDiscount = function(orderValue) {
    if (!this.isValid(orderValue)) {
        return 0;
    }

    let discount = 0;
    if (this.type === 'percentage') {
        discount = (orderValue * this.value) / 100;
    } else {
        discount = this.value;
    }

    // Apply maximum discount if set
    if (this.maxDiscount) {
        discount = Math.min(discount, this.maxDiscount);
    }

    return Math.min(discount, orderValue);
};

const Promotion = mongoose.model('Promotion', promotionSchema);

module.exports = Promotion;