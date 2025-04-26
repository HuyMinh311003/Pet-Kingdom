const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        required: true
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: [true, 'Review comment is required'],
        trim: true,
        maxlength: [500, 'Comment cannot be longer than 500 characters']
    },
    images: [{
        type: String,
        validate: {
            validator: function(url) {
                // Basic URL validation
                try {
                    new URL(url);
                    return true;
                } catch (error) {
                    return false;
                }
            },
            message: 'Invalid image URL'
        }
    }],
    isVerified: {
        type: Boolean,
        default: false
    },
    verifiedAt: {
        type: Date,
        default: null
    },
    verifiedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true
});

// One user can only review a product once per order
reviewSchema.index({ user: 1, product: 1, order: 1 }, { unique: true });

// Add index for product lookup
reviewSchema.index({ product: 1, createdAt: -1 });

// Static method to calculate average rating
reviewSchema.statics.calculateAverageRating = async function(productId) {
    const result = await this.aggregate([
        {
            $match: { product: productId }
        },
        {
            $group: {
                _id: '$product',
                avgRating: { $avg: '$rating' },
                reviewCount: { $sum: 1 }
            }
        }
    ]);

    try {
        if (result.length > 0) {
            await this.model('Product').findByIdAndUpdate(productId, {
                avgRating: Math.round(result[0].avgRating * 10) / 10, // Round to 1 decimal
                reviewCount: result[0].reviewCount
            });
        } else {
            await this.model('Product').findByIdAndUpdate(productId, {
                avgRating: 0,
                reviewCount: 0
            });
        }
    } catch (error) {
        console.error('Error updating product rating:', error);
    }
};

// Call calculateAverageRating after save
reviewSchema.post('save', function() {
    this.constructor.calculateAverageRating(this.product);
});

// Call calculateAverageRating after delete
reviewSchema.post('delete', function() {
    this.constructor.calculateAverageRating(this.product);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;