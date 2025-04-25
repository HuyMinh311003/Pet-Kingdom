const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get or create cart
exports.getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        let cart = await Cart.findOne({ userId }).populate('items.productId');
        
        if (!cart) {
            cart = new Cart({ userId, items: [] });
            await cart.save();
        }
        
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add item to cart
exports.addItem = async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId, quantity } = req.body;

        // Validate product
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if product already in cart
        const existingItem = cart.items.find(item => 
            item.productId.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, quantity });
        }

        await cart.save();
        await cart.populate('items.productId');
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update item quantity
exports.updateQuantity = async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId, quantity } = req.body;

        // Validate product and stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find(item => 
            item.productId.toString() === productId
        );
        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        item.quantity = quantity;
        await cart.save();
        await cart.populate('items.productId');
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Remove item from cart
exports.removeItem = async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId } = req.body;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => 
            item.productId.toString() !== productId
        );

        await cart.save();
        await cart.populate('items.productId');
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Clear cart
exports.clearCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await Cart.findOne({ userId });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = [];
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};