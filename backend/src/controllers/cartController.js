const Cart = require('../models/Cart');
const Product = require('../models/Product');
const mongoose = require('mongoose');

exports.getCart = async (req, res) => {
    try {
        const userId = req.params.userId;

        // 1. Lấy hoặc tạo cart như trước
        let cart = await Cart.findOne({ user: userId })
            .populate({
                path: 'items.product',
                select: 'name price imageUrl stock type'
            });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
            await cart.save();
            await cart.populate({
                path: 'items.product',
                select: 'name price imageUrl stock type'
            });
        }

        const validItems = cart.items.filter(i => i.product != null);

        if (validItems.length !== cart.items.length) {
            cart.items = validItems;
            await cart.save();
        }

        const total = validItems.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);


        res.json({
            success: true,
            data: {
                items: validItems.map(i => ({
                    product: i.product,
                    quantity: i.quantity
                })),
                total
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Error fetching cart',
            error: error.message
        });
    }
};

exports.addItem = async (req, res, next) => {
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product không tồn tại' });

    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = await Cart.create({ user: userId, items: [] });

    const idx = cart.items.findIndex(i => i.product.equals(productId));
    if (idx > -1) {
        if (product.type === 'pet') {
            return res.status(400).json({ message: 'Chỉ được thêm tối đa 1 thú cưng vào giỏ' });
        }
        cart.items[idx].quantity += quantity;
    } else {
        cart.items.push({
            product: productId,
            quantity: product.type === 'pet' ? 1 : quantity
        });
    }
    await cart.save();
    await cart.populate('items.product');

    res.json({ data: cart });
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
    const { userId } = req.params;
    const { productId } = req.body;

    const cart = await Cart.findOneAndUpdate(
        { user: userId },
        { $pull: { items: { product: productId } } },
        { new: true }
    ).populate('items.product');


    return res.json({ data: cart });
};

exports.clearCart = async (req, res) => {
    const { userId } = req.params;
    // xóa toàn bộ cart items
    const cart = await Cart.findOneAndUpdate({ user: userId }, { items: [] }, { new: true });
    return res.json({ data: cart });
};

exports.checkout = async (req, res) => {
    const { userId } = req.params;
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const cart = await Cart.findOne({ user: userId }).populate('items.product').session(session);
        if (!cart || !cart.items.length) {
            throw new Error('Cart empty');
        }

        // 1) Giảm stock trên mỗi sản phẩm
        for (const item of cart.items) {
            const updated = await Product.findOneAndUpdate(
                { _id: item.product._id, stock: { $gte: item.quantity } },
                { $inc: { stock: -item.quantity } },
                { new: true, session }
            );
            if (!updated) {
                throw new Error(`Insufficient stock for ${item.product.name}`);
            }
        }

        // 2) Clear cart
        cart.items = [];
        await cart.save({ session });

        await session.commitTransaction();
        session.endSession();
        res.json({ success: true, message: 'Checkout successful' });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ success: false, message: err.message });
    }
};