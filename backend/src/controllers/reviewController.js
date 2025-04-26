const Review = require('../models/Review');
const Order = require('../models/Order');

exports.createReview = async (req, res) => {
    try {
        const { productId, orderId, rating, comment, images } = req.body;

        // Verify that the order exists and belongs to the user
        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id,
            'items.product': productId,
            status: 'Đã giao'
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found or not eligible for review'
            });
        }

        // Check if user already reviewed this product for this order
        const existingReview = await Review.findOne({
            user: req.user._id,
            product: productId,
            order: orderId
        });

        if (existingReview) {
            return res.status(400).json({
                success: false,
                message: 'You have already reviewed this product for this order'
            });
        }

        const review = new Review({
            user: req.user._id,
            product: productId,
            order: orderId,
            rating,
            comment,
            images
        });

        await review.save();

        // Populate user details for response
        await review.populate('user', 'name avatar');

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating review',
            error: error.message
        });
    }
};

exports.getProductReviews = async (req, res) => {
    try {
        const { 
            verified,
            rating,
            sort = '-createdAt',
            page = 1,
            limit = 10
        } = req.query;

        const query = {
            product: req.params.productId
        };

        if (verified !== undefined) {
            query.isVerified = verified === 'true';
        }

        if (rating) {
            query.rating = Number(rating);
        }

        const total = await Review.countDocuments(query);

        const reviews = await Review.find(query)
            .populate('user', 'name avatar')
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            success: true,
            data: {
                reviews,
                pagination: {
                    total,
                    page: Number(page),
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching reviews',
            error: error.message
        });
    }
};

exports.getUserReviews = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const query = {
            user: req.params.userId
        };

        const total = await Review.countDocuments(query);

        const reviews = await Review.find(query)
            .populate('product', 'name imageUrl')
            .sort('-createdAt')
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            success: true,
            data: {
                reviews,
                pagination: {
                    total,
                    page: Number(page),
                    pages: Math.ceil(total / limit)
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching user reviews',
            error: error.message
        });
    }
};

exports.updateReview = async (req, res) => {
    try {
        const { rating, comment, images } = req.body;

        const review = await Review.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found or not authorized'
            });
        }

        // Only allow updating if not verified yet
        if (review.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Cannot update verified review'
            });
        }

        review.rating = rating;
        review.comment = comment;
        review.images = images;

        await review.save();
        await review.populate('user', 'name avatar');

        res.json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating review',
            error: error.message
        });
    }
};

exports.deleteReview = async (req, res) => {
    try {
        const review = await Review.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found or not authorized'
            });
        }

        // Only allow deleting if not verified yet
        if (review.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete verified review'
            });
        }

        await review.delete();

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting review',
            error: error.message
        });
    }
};

exports.verifyReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        review.isVerified = true;
        review.verifiedAt = new Date();
        review.verifiedBy = req.user._id;

        await review.save();
        await review.populate('user', 'name avatar');
        await review.populate('verifiedBy', 'name');

        res.json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error verifying review',
            error: error.message
        });
    }
};