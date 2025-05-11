const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Reservation = require('../models/Reservation');
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

        // 2. Tính tổng giá
        const total = cart.items.reduce((sum, item) => {
            return sum + (item.product.price * item.quantity);
        }, 0);

        // 3. Lấy tất cả reservation hiện tại của user cho các product đang trong cart
        const productIds = cart.items.map(i => i.product._id);
        const reservations = await Reservation.find({
            user: userId,
            product: { $in: productIds }
        }).select('product expiresAt');

        // 4. Chuyển thành map { productId: latestExpiresAt }
        const expMap = {};
        reservations.forEach(r => {
            const pid = r.product.toString();
            const exp = r.expiresAt.getTime();
            if (!expMap[pid] || expMap[pid] < exp) {
                expMap[pid] = exp;
            }
        });

        // 5. Build lại items trả về, thêm expiresAt (ISO string)
        const itemsWithExpiry = cart.items.map(item => {
            const pid = item.product._id.toString();
            return {
                product: item.product,
                quantity: item.quantity,
                expiresAt: expMap[pid] ? new Date(expMap[pid]).toISOString() : null
            };
        });

        res.json({
            success: true,
            data: {
                items: itemsWithExpiry,
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
    const RESERVATION_TTL_MS = 15 * 60 * 1000;
    const { userId } = req.params;
    const { productId, quantity } = req.body;

    // 1. Load product & cart
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: 'Product không tồn tại' });

    if (product.type === 'pet') {
        // 2. Tính tổng đang reserve
        const agg = await Reservation.aggregate([
            { $match: { product: new mongoose.Types.ObjectId(productId) } },
            { $group: { _id: null, total: { $sum: '$quantity' } } }
        ]);
        const reserved = agg[0]?.total || 0;
        if (reserved + quantity > product.stock) {
            return res.status(400).json({ message: 'Pet đã được người khác giữ hết.' });
        }

        // 3. Tạo reservation mới
        const expiresAt = new Date(Date.now() + RESERVATION_TTL_MS);
        await Reservation.create({ user: userId, product: productId, quantity, expiresAt });
    }

    // 3. Lấy hoặc tạo cart
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = await Cart.create({ user: userId, items: [] });

    // 4. Update items in cart
    const idx = cart.items.findIndex(i => i.product.equals(productId));
    if (idx > -1) {
        cart.items[idx].quantity += quantity;
    } else {
        cart.items.push({ product: productId, quantity });
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

    // 1. Xóa item khỏi cart
    const cart = await Cart.findOneAndUpdate(
        { user: userId },
        { $pull: { items: { product: productId } } },
        { new: true }
    ).populate('items.product');

    // 2. Xóa reservation tương ứng
    await Reservation.deleteOne({ user: userId, product: productId });

    return res.json({ data: cart });
};

exports.clearCart = async (req, res) => {
    const { userId } = req.params;
    // xóa toàn bộ cart items
    const cart = await Cart.findOneAndUpdate({ user: userId }, { items: [] }, { new: true });
    // xóa hết reservation của user
    await Reservation.deleteMany({ user: userId });
    return res.json({ data: cart });
};