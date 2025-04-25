const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// Create a new review
exports.createReview = async (req, res) => {
    try {
        const { userId, productId, orderId, rating, comment } = req.body;

        // Verify that user has purchased the product
        const order = await Order.findOne({
            _id: orderId,
            userId,
            'items.productId': productId,
            status: 'delivered'
        });

        if (!order) {
            return res.status(403).json({ 
                message: 'You can only review products you have purchased' 
            });
        }

        // Check if user has already reviewed this product
        const existingReview = await Review.findOne({ userId, productId });
        if (existingReview) {
            return res.status(400).json({ 
                message: 'You have already reviewed this product' 
            });
        }

        const review = new Review({
            userId,
            productId,
            orderId,
            rating,
            comment,
            date: new Date()
        });

        await review.save();

        // Update product rating
        const productReviews = await Review.find({ productId });
        const avgRating = productReviews.reduce((acc, rev) => acc + rev.rating, 0) / productReviews.length;
        await Product.findByIdAndUpdate(productId, { rating: avgRating.toFixed(1) });

        res.status(201).json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get reviews for a product
exports.getProductReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId })
            .populate('userId', 'name')
            .sort({ date: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get reviews by a user
exports.getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ userId: req.params.userId })
            .populate('productId')
            .sort({ date: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update review
exports.updateReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Only allow updating own reviews
        if (review.userId.toString() !== req.body.userId) {
            return res.status(403).json({ message: 'Not authorized to update this review' });
        }

        review.rating = rating;
        review.comment = comment;
        review.edited = true;
        await review.save();

        // Update product rating
        const productReviews = await Review.find({ productId: review.productId });
        const avgRating = productReviews.reduce((acc, rev) => acc + rev.rating, 0) / productReviews.length;
        await Product.findByIdAndUpdate(review.productId, { rating: avgRating.toFixed(1) });

        res.json(review);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete review
exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Only allow deleting own reviews
        if (review.userId.toString() !== req.body.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this review' });
        }

        await review.deleteOne();

        // Update product rating
        const productReviews = await Review.find({ productId: review.productId });
        const avgRating = productReviews.length > 0
            ? productReviews.reduce((acc, rev) => acc + rev.rating, 0) / productReviews.length
            : 0;
        await Product.findByIdAndUpdate(review.productId, { rating: avgRating.toFixed(1) });

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get review statistics for a product
exports.getReviewStats = async (req, res) => {
    try {
        const reviews = await Review.find({ productId: req.params.productId });
        
        const stats = {
            totalReviews: reviews.length,
            averageRating: 0,
            ratingDistribution: {
                1: 0, 2: 0, 3: 0, 4: 0, 5: 0
            }
        };

        if (reviews.length > 0) {
            // Calculate average rating
            const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
            stats.averageRating = (totalRating / reviews.length).toFixed(1);

            // Calculate rating distribution
            reviews.forEach(review => {
                stats.ratingDistribution[review.rating]++;
            });
        }

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};