const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Category is required']
    },
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be negative']
    },
    imageUrl: {
        type: String,
        required: [true, 'Product image is required']
    },
    type: {
        type: String,
        enum: ['pet', 'tool'],
        required: [true, 'Product type is required']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    // Pet-specific fields
    birthday: {
        type: Date,
        required: function() {
            return this.type === 'pet';
        }
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: function() {
            return this.type === 'pet';
        }
    },
    vaccinated: {
        type: Boolean,
        default: false,
        required: function() {
            return this.type === 'pet';
        }
    },
    // Tool-specific fields (if needed)
    brand: {
        type: String,
        required: function() {
            return this.type === 'tool';
        }
    },
    // Common fields for search and filtering
    tags: [{
        type: String,
        trim: true
    }],
    avgRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    reviewCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    // Add virtual fields for age calculation
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for age calculation
productSchema.virtual('age').get(function() {
    if (this.type !== 'pet' || !this.birthday) return null;
    
    const today = new Date();
    const birthDate = new Date(this.birthday);
    const monthDiff = today.getMonth() - birthDate.getMonth();
    let age = today.getFullYear() - birthDate.getFullYear();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    return age;
});

// Index for search functionality
productSchema.index({ name: 'text', description: 'text', tags: 'text' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;