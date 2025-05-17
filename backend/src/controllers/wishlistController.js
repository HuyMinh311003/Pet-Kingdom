const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

// Get wishlist for a user
exports.getWishlist = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // Check if the requested userId matches the authenticated user
        if (req.user._id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You can only access your own wishlist'
            });
        }

        let wishlist = await Wishlist.findOne({ userId })
            .populate({
                path: 'products',
                select: 'name price imageUrl type stock isActive'
            });

        if (!wishlist) {
            // If wishlist doesn't exist, return an empty list
            return res.json({
                success: true,
                data: {
                    products: []
                }
            });
        }

        // Filter out inactive products
        const activeProducts = wishlist.products.filter(product => product.isActive);

        res.json({
            success: true,
            data: {
                products: activeProducts
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching wishlist',
            error: error.message
        });
    }
};

// Add a product to wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId } = req.body;

        // Check if the requested userId matches the authenticated user
        if (req.user._id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You can only modify your own wishlist'
            });
        }

        // Validate productId
        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid product ID'
            });
        }

        // Check if product exists and is active
        const product = await Product.findOne({ _id: productId, isActive: true });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found or inactive'
            });
        }

        // Find or create wishlist for the user
        let wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            wishlist = new Wishlist({ userId, products: [] });
        }

        // Check if product is already in wishlist
        if (wishlist.products.includes(productId)) {
            return res.status(400).json({
                success: false,
                message: 'Product already in wishlist'
            });
        }

        // Add product to wishlist
        wishlist.products.push(productId);
        await wishlist.save();

        res.status(201).json({
            success: true,
            message: 'Product added to wishlist',
            data: {
                productId
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error adding to wishlist',
            error: error.message
        });
    }
};

// Remove a product from wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        // Check if the requested userId matches the authenticated user
        if (req.user._id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You can only modify your own wishlist'
            });
        }

        // Find wishlist
        const wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist not found'
            });
        }

        // Check if product is in wishlist
        const index = wishlist.products.indexOf(productId);
        if (index === -1) {
            return res.status(404).json({
                success: false,
                message: 'Product not found in wishlist'
            });
        }

        // Remove product from wishlist
        wishlist.products.splice(index, 1);
        await wishlist.save();

        res.json({
            success: true,
            message: 'Product removed from wishlist'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error removing from wishlist',
            error: error.message
        });
    }
};

// Check if a product is in the user's wishlist
exports.checkWishlistItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;

        // Check if the requested userId matches the authenticated user
        if (req.user._id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You can only access your own wishlist'
            });
        }

        const wishlist = await Wishlist.findOne({ userId });
        const isInWishlist = wishlist && wishlist.products.includes(productId);

        res.json({
            success: true,
            data: {
                isInWishlist: !!isInWishlist
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error checking wishlist item',
            error: error.message
        });
    }
};

// Clear the entire wishlist
exports.clearWishlist = async (req, res) => {
    try {
        const { userId } = req.params;

        // Check if the requested userId matches the authenticated user
        if (req.user._id.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'You can only modify your own wishlist'
            });
        }

        const wishlist = await Wishlist.findOne({ userId });
        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist not found'
            });
        }

        wishlist.products = [];
        await wishlist.save();

        res.json({
            success: true,
            message: 'Wishlist cleared'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error clearing wishlist',
            error: error.message
        });
    }
}; 