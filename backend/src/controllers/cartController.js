const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.params.userId })
            .populate({
                path: 'items.product',
                select: 'name price imageUrl stock type'
            });

        if (!cart) {
            cart = new Cart({ user: req.params.userId, items: [] });
            await cart.save();
        }

        // Calculate total
        const total = cart.items.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        res.json({
            success: true,
            data: {
                items: cart.items,
                total
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching cart',
            error: error.message
        });
    }
};

exports.addItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Validate product exists and has sufficient stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock'
            });
        }

        // Get or create cart
        let cart = await Cart.findOne({ user: req.params.userId });
        if (!cart) {
            cart = new Cart({ user: req.params.userId, items: [] });
        }

        // Check if product already in cart
        const existingItem = cart.items.find(item => 
            item.product.toString() === productId
        );

        if (existingItem) {
            // Update quantity if total doesn't exceed stock
            if (existingItem.quantity + quantity > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: 'Cannot add more items than available in stock'
                });
            }
            existingItem.quantity += quantity;
        } else {
            // Add new item
            cart.items.push({
                product: productId,
                quantity
            });
        }

        await cart.save();

        // Return populated cart
        cart = await Cart.findById(cart._id).populate({
            path: 'items.product',
            select: 'name price imageUrl stock type'
        });

        // Calculate total
        const total = cart.items.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        res.json({
            success: true,
            data: {
                items: cart.items,
                total
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error adding item to cart',
            error: error.message
        });
    }
};

exports.updateQuantity = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Validate product exists and has sufficient stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: 'Insufficient stock'
            });
        }

        // Update cart
        let cart = await Cart.findOneAndUpdate(
            { 
                user: req.params.userId,
                'items.product': productId
            },
            {
                $set: {
                    'items.$.quantity': quantity
                }
            },
            { new: true }
        ).populate({
            path: 'items.product',
            select: 'name price imageUrl stock type'
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart or item not found'
            });
        }

        // Calculate total
        const total = cart.items.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        res.json({
            success: true,
            data: {
                items: cart.items,
                total
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error updating cart item',
            error: error.message
        });
    }
};

exports.removeItem = async (req, res) => {
    try {
        const { productId } = req.body;

        // Remove item from cart
        let cart = await Cart.findOneAndUpdate(
            { user: req.params.userId },
            {
                $pull: {
                    items: { product: productId }
                }
            },
            { new: true }
        ).populate({
            path: 'items.product',
            select: 'name price imageUrl stock type'
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        // Calculate total
        const total = cart.items.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        res.json({
            success: true,
            data: {
                items: cart.items,
                total
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error removing item from cart',
            error: error.message
        });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { user: req.params.userId },
            { $set: { items: [] } },
            { new: true }
        );

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        res.json({
            success: true,
            data: {
                items: [],
                total: 0
            }
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error clearing cart',
            error: error.message
        });
    }
};